import itemsData from "./assets/items.json";
import type { ChecklistItem } from "./types/ChecklistItem";
import useLocalStorage from "./hooks/useLocalStorage";
import AddItemForm from "./components/AddItemForm";
import ChecklistList from "./components/ChecklistList";
import Header from "./components/Header";

export default function App() {
  const [items, setItems] = useLocalStorage<ChecklistItem[]>(
    "travel-checklist",
    itemsData
  );

  function addItem(label: string) {
    const newItem: ChecklistItem = {
      id: Date.now(),
      label,
      checked: false
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

  return (
    <div className="app">
      {/* Header contains logo + title */}
      <Header />

      <main>
        <div className="checklist-container">
          <AddItemForm onAdd={addItem} />
          <ChecklistList items={items} onToggle={toggleItem} onDelete={deleteItem} />
          {items.length > 0 && <button className="clear-btn" onClick={clearAll}>Clear All</button>}
        </div>
      </main>

    </div>
  );
}
