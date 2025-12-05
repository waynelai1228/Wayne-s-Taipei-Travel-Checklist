import { useState, useMemo } from "react";
import itemsData from "./assets/items.json";
import type { ScoreField, ChecklistItem } from "./types/ChecklistItem";
import useLocalStorage from "./hooks/useLocalStorage";
import AddItemForm from "./components/AddItemForm";
import ChecklistList from "./components/ChecklistList";
import Header from "./components/Header";
import "./App.css"
import { normalizeScore } from "./utils";

export default function App() {
  const initialItems: ChecklistItem[] = useMemo(() => {
    return itemsData.map((i) => ({
      ...i,
      notes: i.notes ?? "",
      scenicScore: normalizeScore(i.scenicScore),
      romanceScore: normalizeScore(i.romanceScore),
      educationalScore: normalizeScore(i.educationalScore),
      convenienceScore: normalizeScore(i.convenienceScore),
    }));
  }, []);


  const [items, setItems] = useLocalStorage<ChecklistItem[]>(
    "travel-checklist",
    initialItems
  );

  const [editMode, setEditMode] = useState(false);
  function addItem(label: string) {
    const newItem: ChecklistItem = {
      id: Date.now(),
      label,
      checked: false,
      notes: "",

      scenicScore: 0,
      romanceScore: 0,
      educationalScore: 0,
      convenienceScore: 0
    };

    setItems([...items, newItem]);
  }

  function toggleItem(id: number) {
    setItems(
      items.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i
      )
    );
  }

  function deleteItem(id: number) {
    setItems(items.filter((i) => i.id !== id));
  }

  function clearAll() {
    setItems([]);
  }
  function updateNotes(id: number, notes: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  }

  function updateScore(id: number, field: ScoreField, value: number) {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function saveAsJson() {
    const dataStr = JSON.stringify(items, null, 2); // pretty-print JSON
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "checklist.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <Header />

      <main>
        <div className="checklist-container">
          <div className="controls">
            <button
              className={`edit-button ${editMode ? "active" : ""}`}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Done Editing" : "Edit Checklist"}
            </button>

            <button className="save-button" onClick={saveAsJson}>
              Save as JSON
            </button>

            {items.length > 0 && editMode && (
              <button className="clear-button" onClick={clearAll}>
                Clear All Items
              </button>
            )}
          </div>

          <AddItemForm onAdd={addItem} disabled={!editMode} />
          <ChecklistList
            items={items}
            onToggle={toggleItem}
            onDelete={deleteItem}
            onNotesChange={updateNotes}
            onScoreChange={updateScore}
            editMode={editMode}
          />
        </div>
      </main>
    </div>
  );
}
