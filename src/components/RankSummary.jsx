import { motion } from 'framer-motion';
import { RANKS } from '../data/constants';
import { Shield, TrendingUp, Swords, Star } from 'lucide-react';

export default function RankSummary({ totalPoints, events, currentRankIdx, categoryTotals, meta }) {
  const current = RANKS[currentRankIdx];
  const next = RANKS[currentRankIdx + 1];

  let progress = 100;
  let ptsNeeded = 0;
  let evtNeeded = 0;
  if (next) {
    const range = next.points - current.points;
    progress = range > 0 ? Math.min(100, ((totalPoints - current.points) / range) * 100) : 100;
    ptsNeeded = Math.max(0, next.points - totalPoints);
    evtNeeded = Math.max(0, next.events - events);
  }

  const catIcons = {
    quests: '📜',
    diaries: '📖',
    pvm: '⚔️',
    skilling: '⛏️',
    misc: '🏆',
  };
  const catLabels = {
    quests: 'Quests',
    diaries: 'Diaries',
    pvm: 'PvM',
    skilling: 'Skilling',
    misc: 'Misc',
  };

  return (
    <motion.div
      className="rank-summary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="summary-top">
        <div className="summary-rank">
          <img src={current.icon} alt={current.name} className="rank-gem-icon" />
          <div>
            <div className="rank-label">Current Rank</div>
            <div className="rank-name" style={{ color: current.color }}>{current.name}</div>
          </div>
        </div>
        <div className="summary-points">
          <div className="points-value">{totalPoints.toLocaleString()}</div>
          <div className="points-label">Clan Points</div>
        </div>
        {meta && (
          <div className="summary-stats">
            <div className="stat"><span className="stat-val">{meta.totalLevel}</span><span className="stat-label">Total</span></div>
            <div className="stat"><span className="stat-val">{Math.floor(meta.ehp)}</span><span className="stat-label">EHP</span></div>
            <div className="stat"><span className="stat-val">{Math.floor(meta.ehb)}</span><span className="stat-label">EHB</span></div>
            {meta.clogCount > 0 && <div className="stat"><span className="stat-val">{meta.clogCount}</span><span className="stat-label">CLog</span></div>}
          </div>
        )}
      </div>

      {next && (
        <div className="next-rank">
          <div className="next-rank-header">
            <span>Next: <strong style={{ color: next.color }}>{next.name}</strong></span>
            <span className="next-rank-needed">
              {ptsNeeded > 0 && `${ptsNeeded.toLocaleString()} pts`}
              {ptsNeeded > 0 && evtNeeded > 0 && ' + '}
              {evtNeeded > 0 && `${evtNeeded} event${evtNeeded > 1 ? 's' : ''}`}
              {ptsNeeded === 0 && evtNeeded === 0 && 'Requirements met!'}
            </span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              style={{ background: `linear-gradient(90deg, ${current.color}, ${next.color})` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <div className="category-chips">
        {Object.entries(categoryTotals).map(([cat, pts]) => (
          <div key={cat} className="cat-chip">
            <span className="chip-icon">{catIcons[cat]}</span>
            <span className="chip-label">{catLabels[cat]}</span>
            <span className="chip-value">{pts.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
