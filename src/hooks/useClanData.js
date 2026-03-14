import { useState, useCallback, useEffect } from 'react';
import { WOM_GROUP_ID, QUEST_BONUSES, DIARY_TIERS, CA_TIERS, PVM_ITEMS, TOTAL_LEVEL_THRESHOLDS, CLOG_TIERS, CLAN_TENURE } from '../data/constants';
import { QUEST_POINTS } from '../data/questPoints';

const LS_USERNAME = 'clanranks_username';
const LS_MANUAL_OVERRIDES = 'clanranks_manual';
const LS_EVENTS = 'clanranks_events';

// Only stores keys the user has explicitly touched (clicked/typed)
function loadManualOverrides() {
  try { return JSON.parse(localStorage.getItem(LS_MANUAL_OVERRIDES)) || {}; } catch { return {}; }
}

function saveManualOverrides(overrides) {
  localStorage.setItem(LS_MANUAL_OVERRIDES, JSON.stringify(overrides));
}

async function fetchWOM(username) {
  const r = await fetch(`https://api.wiseoldman.net/v2/players/${encodeURIComponent(username)}`);
  if (!r.ok) throw new Error(`Player "${username}" not found on Wise Old Man`);
  return r.json();
}

async function fetchWOMGroup() {
  const r = await fetch(`https://api.wiseoldman.net/v2/groups/${WOM_GROUP_ID}`);
  if (!r.ok) throw new Error('Could not fetch clan data');
  return r.json();
}

async function fetchRuneProfile(username) {
  const r = await fetch(`/api/runeprofile/profiles/${username.replace(/ /g, '%20')}`);
  if (!r.ok) return null;
  return r.json();
}

function buildInitialItems(womData, rpData, groupData, manualOverrides) {
  const snap = womData.latestSnapshot?.data;
  const totalLevel = snap?.skills?.overall?.level || 0;
  const ehp = womData.ehp || 0;
  const ehb = womData.ehb || 0;
  let clogCount = snap?.activities?.collections_logged?.score || 0;
  if (clogCount < 0) clogCount = 0;

  const rpItems = rpData?.items?.map(i => i.name) || [];
  const rpQuests = rpData?.quests || [];
  const rpDiaries = rpData?.achievementDiaryTiers || [];
  const rpCATiers = rpData?.combatAchievementTiers || [];
  const hasRP = !!rpData;

  // Find clan join date
  let clanJoinDate = null;
  if (groupData?.memberships) {
    const displayLower = womData.displayName?.toLowerCase();
    const membership = groupData.memberships.find(
      m => m.player?.displayName?.toLowerCase() === displayLower
    );
    if (membership) clanJoinDate = new Date(membership.createdAt);
  }

  const items = {};

  // Merge: API value wins unless the user explicitly overrode this key.
  // If they did, use their value only if it's "more" than what the API says
  // (i.e. they checked something the API missed, or bumped a number up).
  // If the API now agrees or exceeds, drop the override — the API caught up.
  function mergeValue(key, apiValue, type) {
    if (!(key in manualOverrides)) return apiValue;
    const manual = manualOverrides[key];
    if (type === 'boolean') {
      // User manually checked it and API still says false → keep true
      // API now says true → API wins, we can drop the override
      if (apiValue) {
        delete manualOverrides[key]; // API caught up
        return true;
      }
      return manual; // user's manual choice (true or false)
    } else {
      // User bumped number up beyond API → keep their value
      // API now meets or exceeds → API wins
      if (apiValue >= manual) {
        delete manualOverrides[key];
        return apiValue;
      }
      return manual;
    }
  }

  // --- QUESTS ---
  let questPoints = 0;
  let qpAuto = false;
  if (hasRP && rpQuests.length) {
    qpAuto = true;
    for (const q of rpQuests) {
      if (q.state === 2 && q.type !== 2) {
        questPoints += QUEST_POINTS[q.name] || 0;
      }
    }
  }
  const qpVal = Math.min(questPoints, 333);
  items.quest_points = { value: mergeValue('quest_points', qpVal, 'numeric'), max: 333, auto: qpAuto, type: 'numeric', category: 'quests', label: 'Quest Points' };

  let miniquestCount = 0;
  if (hasRP) {
    miniquestCount = rpQuests.filter(q => q.type === 2 && q.state === 2).length;
  }
  items.miniquests = { value: mergeValue('miniquests', miniquestCount, 'numeric'), max: 19, auto: hasRP, type: 'numeric', category: 'quests', label: 'Miniquests Completed' };

  for (const q of QUEST_BONUSES) {
    let completed = false;
    let auto = false;
    if (hasRP) {
      auto = true;
      const match = rpQuests.find(rq => {
        const a = rq.name.toLowerCase();
        const b = q.questMatch.toLowerCase();
        return a === b || a.startsWith(b);
      });
      completed = match?.state === 2;
    }
    const key = `quest_${q.key}`;
    items[key] = { value: mergeValue(key, completed, 'boolean'), max: q.points, auto, type: 'boolean', category: 'quests', label: q.name };
  }

  // --- DIARIES ---
  let totalDiaryTasks = 0;
  if (hasRP && rpDiaries.length) {
    totalDiaryTasks = rpDiaries.reduce((s, t) => s + t.completedCount, 0);
  }
  items.diary_tasks = { value: mergeValue('diary_tasks', totalDiaryTasks, 'numeric'), max: 492, auto: hasRP && rpDiaries.length > 0, type: 'numeric', category: 'diaries', label: 'Achievements Completed' };

  for (const d of DIARY_TIERS) {
    let complete = false;
    let auto = false;
    if (hasRP && rpDiaries.length) {
      auto = true;
      const atTier = rpDiaries.filter(t => t.tierIndex === d.tierIndex);
      complete = atTier.length > 0 && atTier.every(t => t.completedCount === t.tasksCount);
    }
    const key = `diary_${d.key}`;
    items[key] = { value: mergeValue(key, complete, 'boolean'), max: d.points, auto, type: 'boolean', category: 'diaries', label: d.name };
  }

  // --- PVM ---
  let caPoints = 0;
  let caAuto = false;
  if (hasRP && rpCATiers.length) {
    caPoints = rpCATiers.reduce((s, t) => s + (t.completedCount * t.id), 0);
    caAuto = true;
  }
  items.ca_points = { value: mergeValue('ca_points', caPoints, 'numeric'), max: 2630, auto: caAuto, type: 'numeric', category: 'pvm', label: 'Combat Achievement Points' };

  const CA_THRESHOLDS = { 1: 41, 2: 161, 3: 416, 4: 1064, 5: 1904, 6: 2630 };

  for (const tier of CA_TIERS) {
    let complete = false;
    let auto = false;
    if (hasRP && rpCATiers.length) {
      auto = true;
      complete = caPoints >= CA_THRESHOLDS[tier.id];
    }
    const key = `ca_${tier.key}`;
    items[key] = { value: mergeValue(key, complete, 'boolean'), max: tier.points, auto, type: 'boolean', category: 'pvm', label: tier.name };
  }

  for (const item of PVM_ITEMS) {
    let found = false;
    let auto = false;
    if (hasRP) {
      auto = true;
      if (item.matchAll) {
        found = item.search.every(s => rpItems.includes(s));
      } else if (item.questFallback) {
        found = item.search.some(s => rpItems.includes(s));
        if (!found) {
          const q = rpQuests.find(rq => rq.name === item.questFallback);
          found = q?.state === 2;
        }
      } else {
        found = item.search.some(s => rpItems.includes(s));
      }
    }
    const key = `item_${item.key}`;
    items[key] = { value: mergeValue(key, found, 'boolean'), max: item.points, auto, type: 'boolean', category: 'pvm', label: item.name };
  }

  const ehbVal = Math.min(Math.floor(ehb), 1250);
  items.ehb = { value: mergeValue('ehb', ehbVal, 'numeric'), max: 1250, auto: true, type: 'numeric', category: 'pvm', label: 'EHB (Efficient Hours Bossed)' };

  // --- SKILLING ---
  for (const t of TOTAL_LEVEL_THRESHOLDS) {
    const key = `total_${t.level}`;
    items[key] = { value: mergeValue(key, totalLevel >= t.level, 'boolean'), max: t.points, auto: true, type: 'boolean', category: 'skilling', label: `${t.level} Total Level` };
  }

  const ehpVal = Math.min(Math.floor(ehp), 1250);
  items.ehp = { value: mergeValue('ehp', ehpVal, 'numeric'), max: 1250, auto: true, type: 'numeric', category: 'skilling', label: 'EHP (Efficient Hours Played)' };

  // --- MISC ---
  for (const tier of CLOG_TIERS) {
    const key = `clog_${tier.name}`;
    items[key] = { value: mergeValue(key, clogCount >= tier.threshold, 'boolean'), max: tier.points, auto: clogCount > 0, type: 'boolean', category: 'misc', label: `Collection log (${tier.name}) — ${tier.threshold}+ items` };
  }

  items.music_cape = { value: mergeValue('music_cape', false, 'boolean'), max: 100, auto: false, type: 'boolean', category: 'misc', label: 'Music cape' };

  const now = new Date();
  for (const tenure of CLAN_TENURE) {
    let met = false;
    let auto = false;
    if (clanJoinDate) {
      auto = true;
      const monthsIn = (now - clanJoinDate) / (1000 * 60 * 60 * 24 * 30.44);
      met = monthsIn >= tenure.months;
    }
    const key = `tenure_${tenure.months}`;
    items[key] = { value: mergeValue(key, met, 'boolean'), max: tenure.points, auto, type: 'boolean', category: 'misc', label: tenure.label };
  }

  return { items, meta: { totalLevel, ehp, ehb, clogCount, clanJoinDate, displayName: womData.displayName } };
}

export function useClanData() {
  const [items, setItems] = useState({});
  const [events, setEvents] = useState(() => {
    try { return parseInt(localStorage.getItem(LS_EVENTS)) || 0; } catch { return 0; }
  });
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rpMissing, setRpMissing] = useState(false);
  const [savedUsername, setSavedUsername] = useState(() => localStorage.getItem(LS_USERNAME) || '');

  const lookup = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    setRpMissing(false);
    try {
      const [womData, groupData, rpData] = await Promise.all([
        fetchWOM(username),
        fetchWOMGroup(),
        fetchRuneProfile(username).catch(() => null),
      ]);
      if (!rpData) setRpMissing(true);

      // Load manual overrides — mergeValue will mutate this to prune stale ones
      const manualOverrides = loadManualOverrides();
      const result = buildInitialItems(womData, rpData, groupData, manualOverrides);

      setItems(result.items);
      setMeta(result.meta);

      // Persist username and cleaned-up overrides
      localStorage.setItem(LS_USERNAME, username);
      setSavedUsername(username);
      saveManualOverrides(manualOverrides);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback((key, value) => {
    setItems(prev => {
      const next = { ...prev, [key]: { ...prev[key], value } };
      // Record this as a manual override
      const overrides = loadManualOverrides();
      overrides[key] = value;
      saveManualOverrides(overrides);
      return next;
    });
  }, []);

  const updateEvents = useCallback((val) => {
    setEvents(val);
    localStorage.setItem(LS_EVENTS, val);
  }, []);

  // Auto-lookup on mount if we have a saved username
  useEffect(() => {
    if (savedUsername) {
      lookup(savedUsername);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { items, events, setEvents: updateEvents, meta, loading, error, rpMissing, lookup, updateItem, savedUsername };
}
