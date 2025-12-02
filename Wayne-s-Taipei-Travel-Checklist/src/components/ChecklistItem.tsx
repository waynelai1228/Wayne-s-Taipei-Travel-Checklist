import type { ChecklistItem } from "../types/ChecklistItem";
import './Checklist.css';

interface ChecklistItemProps {
  item: ChecklistItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ChecklistItemComponent({
  item,
  onToggle,
  onDelete,
}: ChecklistItemProps) {
  return (
    <div className="checklist-item">
      <label>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
        />
        <span className={item.checked ? "checked" : ""}>
          {item.label}
        </span>
      </label>

      <button onClick={() => onDelete(item.id)}>X</button>
    </div>
  );
}
