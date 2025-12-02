import { useState } from "react";
import type { FormEvent } from "react";
import './Checklist.css';

interface AddItemFormProps {
  onAdd: (label: string) => void;
}

export default function AddItemForm({ onAdd }: AddItemFormProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="add-item-form">
      <input
        type="text"
        placeholder="Add checklist item..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
