import itemsData from "./assets/items.json";
import type { ChecklistItem } from "./types/ChecklistItem";
import useLocalStorage from "./hooks/useLocalStorage";
import AddItemForm from "./components/AddItemForm";
import ChecklistList from "./components/ChecklistList";
import Header from "./components/Header";

export default function App() {
  const initialItems = itemsData.map(i => ({
    ...i,
    notes: i.notes ?? "",
    scenicScore: i.scenicScore ?? 0,
    romanceScore: i.romanceScore ?? 0,
    educationalScore: i.educationalScore ?? 0,
    convenienceScore: i.convenienceScore ?? 0
  }));

  const [items, setItems] = useLocalStorage<ChecklistItem[]>(
    "travel-checklist",
    initialItems
  );

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

  return (
    <div className="app">
      {/* Header contains logo + title */}
      <Header />

      <main>
        <div className="checklist-container">
          <AddItemForm onAdd={addItem} />
          <ChecklistList items={items} onToggle={toggleItem} onDelete={deleteItem} onNotesChange={updateNotes} />
          {items.length > 0 && <button className="clear-btn" onClick={clearAll}>Clear All</button>}
        </div>
      </main>

    </div>
  );
}
