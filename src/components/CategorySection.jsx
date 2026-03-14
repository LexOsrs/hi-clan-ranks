import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';

function ItemRow({ itemKey, item, onUpdate }) {
  const earned = item.type === 'boolean'
    ? (item.value ? item.max : 0)
    : Math.min(item.value || 0, item.max);

  return (
    <div className="item-row">
      {item.type === 'boolean' ? (
        <label className="item-toggle">
          <input
            type="checkbox"
            checked={!!item.value}
            onChange={e => onUpdate(itemKey, e.target.checked)}
          />
          <span className={`toggle-box ${item.value ? 'checked' : ''}`}>
            {item.value ? <Check size={14} /> : null}
          </span>
        </label>
      ) : (
        <div className="item-input-wrap">
          <input
            type="number"
            className="item-input"
            value={item.value}
            min={0}
            max={item.max}
            onChange={e => {
              let v = parseInt(e.target.value) || 0;
              v = Math.max(0, Math.min(v, item.max));
              onUpdate(itemKey, v);
            }}
          />
        </div>
      )}
      <span className="item-label">{item.label}</span>
      <span className={`auto-tag ${item.auto ? 'is-auto' : 'is-manual'}`}>
        {item.auto ? 'auto' : 'manual'}
      </span>
      <span className={`item-pts ${earned >= item.max ? 'maxed' : earned > 0 ? 'partial' : ''}`}>
        {earned} / {item.max}
      </span>
    </div>
  );
}

const SECTION_META = {
  quests: { icon: '📜', title: 'Quests' },
  diaries: { icon: '📖', title: 'Achievement Diaries' },
  pvm: { icon: '⚔️', title: 'PvM' },
  skilling: { icon: '⛏️', title: 'Skilling' },
  misc: { icon: '🏆', title: 'Miscellaneous' },
};

export default function CategorySection({ category, items, totalPoints, maxPoints, onUpdate }) {
  const [open, setOpen] = useState(true);
  const meta = SECTION_META[category] || { icon: '📋', title: category };

  const entries = Object.entries(items).filter(([, v]) => v.category === category);

  return (
    <motion.div
      className="category-section"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button className="section-header" onClick={() => setOpen(!open)}>
        <div className="section-left">
          <span className="section-icon">{meta.icon}</span>
          <span className="section-title">{meta.title}</span>
        </div>
        <div className="section-right">
          <span className="section-pts">
            <strong>{totalPoints.toLocaleString()}</strong>
            <span className="pts-max"> / {maxPoints.toLocaleString()}</span>
          </span>
          <ChevronDown size={18} className={`chevron ${open ? 'open' : ''}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="section-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="section-items">
              {entries.map(([key, item]) => (
                <ItemRow key={key} itemKey={key} item={item} onUpdate={onUpdate} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
