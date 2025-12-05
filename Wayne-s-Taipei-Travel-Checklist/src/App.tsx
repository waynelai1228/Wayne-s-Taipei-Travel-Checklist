import { useState, useMemo } from "react";
import itemsData from "./assets/items.json";
import type { ScoreField, ChecklistItem } from "./types/ChecklistItem";
import useLocalStorage from "./hooks/useLocalStorage";
import AddItemForm from "./components/AddItemForm";
import ChecklistList from "./components/ChecklistList";
import Header from "./components/Header";
import "./App.css"
import { normalizeScore } from "./utils/input_utils";
import { clearAllImages, deleteImage } from "./utils/indexedDB";
import { exportChecklist } from "./utils/export";
import { importChecklist } from "./utils/import";
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

  async function deleteItem(id: number) {
    await deleteImage(id.toString());
    setItems(items.filter((i) => i.id !== id));
  }

  async function clearAll() {
    // Delete all images from IndexedDB
    await clearAllImages();

    // Clear the items state
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

  // ----------------------------
  // Import Function
  // ----------------------------
  async function importItems() {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();

          const imported = await importChecklist(text);
          setItems(imported);
        } catch (err) {
          alert("Failed to import checklist: " + err);
        }
      };

      input.click();
    } catch (err) {
      alert("Unexpected import error." + err);
    }
  }

  async function saveAsJson() {
    const data = await exportChecklist(items);
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "checklist.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function resetDefault() {
    await clearAllImages();
    setItems(initialItems);
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

            <button className="import-button" onClick={importItems}>
              Import Items
            </button>

            <button className="save-button" onClick={saveAsJson}>
              Save as JSON
            </button>

            <button className="reset-button" onClick={resetDefault}>
              Reset to Default
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
