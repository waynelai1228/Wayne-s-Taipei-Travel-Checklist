import { useEffect, useState } from "react";
import type { ScoreField, ChecklistItem } from "../types/ChecklistItem";
import expandIcon from "../assets/expand_sign.svg";
import { normalizeScore } from "../utils/input_utils";
import { saveImage, getImage } from "../utils/indexedDB";

interface ChecklistItemProps {
  item: ChecklistItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onLabelChange: (id: number, newLabel: string) => void;
  onNotesChange: (id: number, notes: string) => void;
  onScoreChange: (id: number, field: ScoreField, value: number) => void;
  editMode: boolean;
}

export default function ChecklistItemComponent({
  item,
  onToggle,
  onDelete,
  onLabelChange,
  onNotesChange,
  onScoreChange,
  editMode
}: ChecklistItemProps) {
  const [notes, setNotes] = useState(item.notes || "");
  const [open, setOpen] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [localLabel, setLocalLabel] = useState(item.label);

  useEffect(() => {
    setLocalLabel(item.label);
  }, [item.label]);

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
  }, [item.id, item.imageVersion]); // <-- watch imageVersion

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
          onChange={() => onToggle(item.id)}
        />

        <div
          className="item-label"
          onClick={() => !editMode && setOpen(!open)}
        >
          {/* Item label stuff, edit item label stuff */ }
          {editMode ? (
            <input
              className="item-label-input"
              value={localLabel}
              onChange={(e) => setLocalLabel(e.target.value)}
              onBlur={() => onLabelChange(item.id, localLabel)}
              onKeyDown={(e) => e.key === "Enter" && onLabelChange(item.id, localLabel)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span className={item.checked ? "checked" : ""}>{item.label}</span>
            </>
          )}

          {/* Expand icon should *always* show, editMode or not */}
          <img
            src={expandIcon}
            alt="Expand"
            className={`expand-icon ${open ? "open" : ""}`}
            onClick={(e) => {
              e.stopPropagation(); // clicking icon only toggles expand
              setOpen(!open);
            }}
          />
        </div>


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

          {/* LEFT SIDE — IMAGE WITH EDIT OVERLAY */}
          <div className="image-wrapper">

            {imageURL && (
              <img
                src={imageURL}
                alt="Attached"
                className={`attached-image ${editMode ? "blurred" : ""}`}
              />
            )}

            {/* Overlay upload button (only in edit mode) */}
            {imageURL && editMode && (
              <label className="image-upload-overlay">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div className="upload-text">
                  + Upload / Replace Image
                </div>
              </label>
            )}

            {/* If no image at all */}
            {!imageURL && (
              <label className="image-upload-placeholder">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div className="upload-text">+ Upload Image</div>
              </label>
            )}
          </div>

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
