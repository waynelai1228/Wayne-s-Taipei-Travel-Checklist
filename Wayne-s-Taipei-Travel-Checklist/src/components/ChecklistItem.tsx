import { useState, useEffect } from "react";
import type { ChecklistItem } from "../types/ChecklistItem";
import expandIcon from "../assets/expand_sign.svg";


interface ChecklistItemProps {
  item: ChecklistItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onNotesChange: (id: number, notes: string) => void;
}

export default function ChecklistItemComponent({
  item,
  onToggle,
  onDelete,
  onNotesChange,
}: ChecklistItemProps) {
  const [notes, setNotes] = useState(item.notes || "");
  const [open, setOpen] = useState(false);

  function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setNotes(val);
    onNotesChange(item.id, val);
  }

  return (
    <div className="checklist-item">
      <div className="item-header">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
        />

        {/* Label and expand icon */}
        <div className="item-label" onClick={() => setOpen(!open)}>
          <span className={item.checked ? "checked" : ""}>{item.label}</span>

          <img
            src={expandIcon}
            alt="Expand"
            className={`expand-icon ${open ? "open" : ""}`}
          />
        </div>

        {/* Delete button */}
        <button
          className="delete-btn"
          aria-label="Delete item"
          onClick={() => onDelete(item.id)}
        >
          X
        </button>
      </div>

      {open && (
        <div className="item-details">
          <table className="score-table">
            <tbody>
              <tr>
                <td className="score-label">Scenic Score</td>
                <td className="score-value">{item.scenicScore}</td>
              </tr>
              <tr>
                <td className="score-label">Romance Score</td>
                <td className="score-value">{item.romanceScore}</td>
              </tr>
              <tr>
                <td className="score-label">Educational Score</td>
                <td className="score-value">{item.educationalScore}</td>
              </tr>
              <tr>
                <td className="score-label">Convenience Score</td>
                <td className="score-value">{item.convenienceScore}</td>
              </tr>
            </tbody>
          </table>

          <div className="notes-section">
            <label className="notes-label">Notes:</label>
            <textarea
              className="notes-textarea"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
