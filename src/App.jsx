import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle, Info } from 'lucide-react';
import { useClanData } from './hooks/useClanData';
import { RANKS } from './data/constants';
import RankBadges from './components/RankBadges';
import RankSummary from './components/RankSummary';
import CategorySection from './components/CategorySection';
import EventInput from './components/EventInput';
import './App.css';

const CATEGORIES = ['quests', 'diaries', 'pvm', 'skilling', 'misc'];

function App() {
  const { items, events, setEvents, meta, loading, error, rpMissing, lookup, updateItem, savedUsername } = useClanData();
  const [username, setUsername] = useState(savedUsername);

  const hasData = Object.keys(items).length > 0;

  const { totalPoints, categoryTotals, categoryMaxes, currentRankIdx } = useMemo(() => {
    let total = 0;
    const catTotals = {};
    const catMaxes = {};

    for (const [, item] of Object.entries(items)) {
      const earned = item.type === 'boolean'
        ? (item.value ? item.max : 0)
        : Math.min(item.value || 0, item.max);
      total += earned;
      catTotals[item.category] = (catTotals[item.category] || 0) + earned;
      catMaxes[item.category] = (catMaxes[item.category] || 0) + item.max;
    }

    let rankIdx = 0;
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (total >= RANKS[i].points && events >= RANKS[i].events) {
        rankIdx = i;
        break;
      }
    }

    return { totalPoints: total, categoryTotals: catTotals, categoryMaxes: catMaxes, currentRankIdx: rankIdx };
  }, [items, events]);

  const handleLookup = () => {
    if (username.trim()) lookup(username.trim());
  };

  return (
    <div className="app">
      <header className="app-header">
        <img src="/clan-logo.webp" alt="Hardly Iron" className="clan-logo" />
        <div>
          <h1>Hardly Iron</h1>
          <p className="subtitle">Clan Rank Calculator</p>
        </div>
      </header>

      <main className="app-main">
        <div className="search-bar">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Enter your RSN..."
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLookup()}
              disabled={loading}
            />
          </div>
          <button className="search-btn" onClick={handleLookup} disabled={loading || !username.trim()}>
            {loading ? <Loader2 size={18} className="spinner" /> : 'Look Up'}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div className="alert alert-error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
          {rpMissing && !error && (
            <motion.div className="alert alert-info" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Info size={16} /> RuneProfile not found — WOM data loaded. Toggle items manually.
            </motion.div>
          )}
        </AnimatePresence>

        {hasData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <RankBadges currentRankIdx={currentRankIdx} />
            <RankSummary
              totalPoints={totalPoints}
              events={events}
              currentRankIdx={currentRankIdx}
              categoryTotals={categoryTotals}
              meta={meta}
            />
            <EventInput value={events} onChange={setEvents} />
            {CATEGORIES.map(cat => (
              <CategorySection
                key={cat}
                category={cat}
                items={items}
                totalPoints={categoryTotals[cat] || 0}
                maxPoints={categoryMaxes[cat] || 0}
                onUpdate={updateItem}
              />
            ))}
          </motion.div>
        )}
      </main>

      <footer className="app-footer">
        <a href="/infographic.html">Points Guide</a>
        <span>·</span>
        <a href="https://wiseoldman.net/groups/1169" target="_blank" rel="noreferrer">Wise Old Man</a>
        <span>·</span>
        <a href="https://discord.gg/hardly" target="_blank" rel="noreferrer">Discord</a>
      </footer>
    </div>
  );
}

export default App;
