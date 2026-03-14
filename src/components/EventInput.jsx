import { Minus, Plus } from 'lucide-react';

export default function EventInput({ value, onChange }) {
  return (
    <div className="event-input-section">
      <div className="event-label">Event Participation</div>
      <div className="event-controls">
        <button
          className="event-btn"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
        >
          <Minus size={16} />
        </button>
        <span className="event-value">{value}</span>
        <button
          className="event-btn"
          onClick={() => onChange(value + 1)}
        >
          <Plus size={16} />
        </button>
      </div>
      <span className="event-tag">manual</span>
    </div>
  );
}
