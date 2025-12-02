import type { ChecklistItem } from "../types/ChecklistItem";
import ChecklistItemComponent from "./ChecklistItem";
import './Checklist.css';

interface ChecklistListProps {
  items: ChecklistItem[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ChecklistList({
  items,
  onToggle,
  onDelete,
}: ChecklistListProps) {
  return (
    <div className="checklist-list">
      {items.length === 0 && <p>No items yet. Add something!</p>}

      {items.map((item) => (
        <ChecklistItemComponent
          key={item.id}
          item={item}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
