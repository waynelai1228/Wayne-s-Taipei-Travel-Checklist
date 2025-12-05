import type { ScoreField, ChecklistItem } from "../types/ChecklistItem";
import ChecklistItemComponent from "./ChecklistItem";
import './Checklist.css';


interface ChecklistListProps {
  items: ChecklistItem[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onLabelChange: (id: number, newLabel: string) => void;
  onNotesChange: (id: number, notes: string) => void;
  onScoreChange: (id: number, field: ScoreField, value: number) => void;
  editMode: boolean;
}

export default function ChecklistList(props: ChecklistListProps) {
  const { items, onToggle, onDelete, onLabelChange, onNotesChange, onScoreChange, editMode } = props;

  return (
    <div className="checklist-list">
      {items.map(item => (
        <ChecklistItemComponent
          key={`${item.id}-${item.imageVersion ?? 0}`} // force remount if version changes
          item={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onLabelChange={onLabelChange}
          onNotesChange={onNotesChange}
          onScoreChange={onScoreChange}
          editMode={editMode}
        />
      ))}
    </div>
  );
}