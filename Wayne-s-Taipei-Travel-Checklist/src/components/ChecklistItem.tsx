import { useEffect, useState } from "react";
import type { ScoreField, ChecklistItem } from "../types/ChecklistItem";
import expandIcon from "../assets/expand_sign.svg";
import { normalizeScore } from "../utils/input_utils";
import { saveImage, getImage } from "../utils/indexedDB";

interface ChecklistItemProps {
  item: ChecklistItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onNotesChange: (id: number, notes: string) => void;
  onScoreChange: (id: number, field: ScoreField, value: number) => void;
  editMode: boolean;
}

export default function ChecklistItemComponent({
  item,
  onToggle,
  onDelete,
  onNotesChange,
  onScoreChange,
  editMode
}: ChecklistItemProps) {
  const [notes, setNotes] = useState(item.notes || "");
  const [open, setOpen] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);

  // Load image from IndexedDB
  useEffect(() => {
    let canceled = false;

    getImage(item.id.toString()).then(blob => {
      if (!canceled && blob) {
        setImageURL(URL.createObjectURL(blob));
      } else if (!canceled) {
        setImageURL(null); // clear if no image
      }
    });

    return () => {
      canceled = true;
    };
  }, [item.imageVersion]); // <-- watch imageVersion

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    await saveImage(item.id.toString(), file);
    setImageURL(URL.createObjectURL(file));
  }

  const scoreFields: [ScoreField, string][] = [
    ["scenicScore", "Scenic Score"],
    ["romanceScore", "Romance Score"],
    ["educationalScore", "Educational Score"],
    ["convenienceScore", "Convenience Score"]
  ];

  function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setNotes(val);
    onNotesChange(item.id, val);
  }

  // --- Inner component for each score input ---
  function ScoreInput({ field, value }: { field: ScoreField; value: number }) {
    const [inputValue, setInputValue] = useState(value.toString());

    function commit() {
      const num = normalizeScore(inputValue);
      onScoreChange(item.id, field, num);
      setInputValue(num.toString());
    }

    return editMode ? (
      <input
        type="number"
        min={0}
        max={10}
        className="score-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
      />
    ) : (
      value
    );
  }

  return (
    <div className="checklist-item">
      <div className="item-header">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => editMode && onToggle(item.id)}
          disabled={!editMode}
        />

        <div className="item-label" onClick={() => setOpen(!open)}>
          <span className={item.checked ? "checked" : ""}>{item.label}</span>
          <img
            src={expandIcon}
            alt="Expand"
            className={`expand-icon ${open ? "open" : ""}`}
          />
        </div>

        {editMode && (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </>
        )}        

        {editMode && (
          <button
            className="delete-btn"
            aria-label="Delete item"
            onClick={() => onDelete(item.id)}
          >
            X
          </button>
        )}
      </div>

      {open && (
        <div className="item-details">

          {/* LEFT SIDE — IMAGE */}
          {imageURL && (
            <div className="image-wrapper">
              <img
                src={imageURL}
                alt="Attached"
                className="attached-image"
              />
            </div>
          )}

          {/* RIGHT SIDE — SCORE TABLE + NOTES */}
          <div className="details-right">
            <table className="score-table">
              <tbody>
                {scoreFields.map(([field, label]) => (
                  <tr key={field}>
                    <td className="score-label">{label}</td>
                    <td className="score-value">
                      <ScoreInput field={field} value={item[field]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="notes-section">
              <label className="notes-label">Notes:</label>
              <textarea
                className="notes-textarea"
                value={notes}
                onChange={handleNotesChange}
                disabled={!editMode}
                placeholder="Add notes..."
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
