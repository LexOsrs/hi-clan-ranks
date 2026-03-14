export const RANKS = [
  { name: 'Helper', points: 0, events: 0, color: '#7a7a7a', icon: '/ranks/Helper.png' },
  { name: 'Sapphire', points: 500, events: 0, color: '#2e5fb8', icon: '/ranks/Sapphire.png' },
  { name: 'Emerald', points: 1000, events: 0, color: '#2ecc40', icon: '/ranks/Emerald.png' },
  { name: 'Ruby', points: 2000, events: 0, color: '#e74c3c', icon: '/ranks/Ruby.png' },
  { name: 'Diamond', points: 3500, events: 0, color: '#a8d8ea', icon: '/ranks/Diamond.png' },
  { name: 'Dragonstone', points: 5000, events: 1, color: '#af7ac5', icon: '/ranks/Dragonstone.png' },
  { name: 'Onyx', points: 6500, events: 2, color: '#8a8a8a', icon: '/ranks/Onyx.png' },
  { name: 'Zenyte', points: 8250, events: 3, color: '#e6a800', icon: '/ranks/Zenyte.png' },
  { name: 'Beast', points: 10000, events: 4, color: '#c0392b', icon: '/ranks/Beast.png' },
  { name: 'Wrath', points: 12500, events: 5, color: '#8e44ad', icon: '/ranks/Wrath_rune.png' },
];

export const WOM_GROUP_ID = 1169;

export const QUEST_BONUSES = [
  { key: 'rfd', name: 'Recipe for Disaster', questMatch: 'Recipe for Disaster', points: 50 },
  { key: 'mm2', name: 'Monkey Madness II', questMatch: 'Monkey Madness II', points: 50 },
  { key: 'ds2', name: 'Dragon Slayer II', questMatch: 'Dragon Slayer II', points: 100 },
  { key: 'sote', name: 'Song of the Elves', questMatch: 'Song of the Elves', points: 50 },
  { key: 'akd', name: 'A Kingdom Divided', questMatch: 'A Kingdom Divided', points: 50 },
  { key: 'dt2', name: 'Desert Treasure II', questMatch: 'Desert Treasure II - The Fallen Empire', points: 100 },
  { key: 'wgs', name: 'While Guthix Sleeps', questMatch: 'While Guthix Sleeps', points: 50 },
];

export const DIARY_TIERS = [
  { key: 'easy', name: 'Easy Achievement Diaries', tierIndex: 0, points: 50 },
  { key: 'medium', name: 'Medium Achievement Diaries', tierIndex: 1, points: 50 },
  { key: 'hard', name: 'Hard Achievement Diaries', tierIndex: 2, points: 100 },
  { key: 'elite', name: 'Elite Achievement Diaries', tierIndex: 3, points: 200 },
];

export const CA_TIERS = [
  { key: 'ca_easy', name: 'Easy Combat Achievements — 41+ pts', id: 1, points: 50 },
  { key: 'ca_medium', name: 'Medium Combat Achievements — 161+ pts', id: 2, points: 50 },
  { key: 'ca_hard', name: 'Hard Combat Achievements — 416+ pts', id: 3, points: 100 },
  { key: 'ca_elite', name: 'Elite Combat Achievements — 1,064+ pts', id: 4, points: 100 },
  { key: 'ca_master', name: 'Master Combat Achievements — 1,904+ pts', id: 5, points: 200 },
  { key: 'ca_gm', name: 'Grandmaster Combat Achievements — 2,630 pts', id: 6, points: 300 },
];

export const PVM_ITEMS = [
  { key: 'dragon_defender', name: 'Dragon defender', points: 50, search: ['Dragon defender'] },
  { key: 'fighter_torso', name: 'Fighter torso', points: 50, search: ['Fighter torso'] },
  { key: 'fire_cape', name: 'Fire cape', points: 100, search: ['Fire cape'] },
  { key: 'void_set', name: 'Void Knight Set', points: 50, search: ['Void knight top', 'Void knight robe', 'Void knight gloves'] },
  { key: 'imbued_cape', name: 'Imbued god cape', points: 50, search: ['Imbued saradomin cape', 'Imbued zamorak cape', 'Imbued guthix cape'], questFallback: 'Mage Arena II' },
  { key: 'vorkath_head', name: "Vorkath's head", points: 50, search: ["Vorkath's head"] },
  { key: 'gauntlet_cape', name: 'Gauntlet cape', points: 50, search: ['Gauntlet cape'] },
  { key: 'deadeye_vigour', name: 'Deadeye & Mystic vigour', points: 50, search: ['Deadeye', 'Mystic vigour'] },
  { key: 'vile_transfer', name: 'Rite of vile transference', points: 100, search: ['Rite of vile transference'] },
  { key: 'torn_scroll', name: 'Torn prayer scroll', points: 50, search: ['Torn prayer scroll'] },
  { key: 'thread_elidinis', name: 'Thread of elidinis', points: 50, search: ['Thread of elidinis'] },
  { key: 'masori_kit', name: 'Masori crafting kit', points: 25, search: ['Masori crafting kit'] },
  { key: 'menaphite_kit', name: 'Menaphite ornament kit', points: 25, search: ['Menaphite ornament kit'] },
  { key: 'cursed_phalanx', name: 'Cursed phalanx', points: 50, search: ['Cursed phalanx'] },
  { key: 'toa_remnants', name: 'ToA Remnants', points: 100, search: ['Remnant of akkha', 'Remnant of ba-ba', 'Remnant of kephri', 'Remnant of zebak', 'Ancient remnant'], matchAll: true },
  { key: 'xerics_guard', name: "Xeric's guard", points: 200, search: ["Xeric's guard"] },
  { key: 'sinhaza', name: 'Sinhaza shroud tier 1', points: 200, search: ['Sinhaza shroud tier 1'] },
  { key: 'ichtlarin', name: "Icthlarin's shroud (tier 1)", points: 200, search: ["Icthlarin's shroud (tier 1)"] },
  { key: 'infernal', name: 'Infernal cape', points: 200, search: ['Infernal cape'] },
  { key: 'dizana', name: "Dizana's quiver", points: 200, search: ["Dizana's quiver"] },
  { key: 'ancient_blood', name: 'Ancient blood ornament kit', points: 300, search: ['Ancient blood ornament kit'] },
  { key: 'purifying_sigil', name: 'Purifying sigil', points: 300, search: ['Purifying sigil'] },
];

export const TOTAL_LEVEL_THRESHOLDS = [
  { level: 1250, points: 100 },
  { level: 1500, points: 100 },
  { level: 1750, points: 100 },
  { level: 2000, points: 200 },
  { level: 2100, points: 200 },
  { level: 2200, points: 250 },
  { level: 2300, points: 300 },
  { level: 2376, points: 350 },
];

export const CLOG_TIERS = [
  { name: 'bronze', threshold: 100, points: 100 },
  { name: 'iron', threshold: 300, points: 100 },
  { name: 'steel', threshold: 500, points: 200 },
  { name: 'black', threshold: 700, points: 200 },
  { name: 'mithril', threshold: 900, points: 200 },
  { name: 'adamant', threshold: 1000, points: 200 },
  { name: 'rune', threshold: 1100, points: 250 },
  { name: 'dragon', threshold: 1200, points: 250 },
  { name: 'gilded', threshold: 1525, points: 500 },
];

export const CLAN_TENURE = [
  { label: '1 Month in Clan', months: 1, points: 30 },
  { label: '3 Months in Clan', months: 3, points: 90 },
  { label: '6 Months in Clan', months: 6, points: 180 },
  { label: '1 Year in Clan', months: 12, points: 360 },
  { label: '2 Years in Clan', months: 24, points: 720 },
];
