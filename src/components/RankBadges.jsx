import { motion } from 'framer-motion';
import { RANKS } from '../data/constants';

export default function RankBadges({ currentRankIdx }) {
  return (
    <div className="rank-badges">
      {RANKS.map((rank, i) => {
        const achieved = i <= currentRankIdx;
        const isCurrent = i === currentRankIdx;
        return (
          <motion.div
            key={rank.name}
            className={`rank-badge ${achieved ? 'achieved' : ''} ${isCurrent ? 'current' : ''}`}
            style={{
              '--rank-color': rank.color,
              borderColor: achieved ? rank.color : undefined,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="badge-name">{rank.name}</span>
            <span className="badge-pts">{rank.points.toLocaleString()}</span>
            {rank.events > 0 && <span className="badge-evt">+{rank.events} evt</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
