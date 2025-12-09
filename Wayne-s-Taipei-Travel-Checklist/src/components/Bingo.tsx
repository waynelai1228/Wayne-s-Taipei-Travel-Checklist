import { useState } from "react";
import type { ChecklistItem } from "../types/ChecklistItem";
import "./Bingo.css";

interface BingoProps {
  items: ChecklistItem[];
}

export default function Bingo({ items }: BingoProps) {
  const [bingoOpen, setBingoOpen] = useState(true);
  const [showIds, setShowIds] = useState(true); // togglable ID display

  // Compute largest N where N^2 <= items.length
  const maxGridSize = Math.floor(Math.sqrt(items.length));
  const totalCells = maxGridSize * maxGridSize;

  // Single regenerate function
  const regenerateBoard = (): ChecklistItem[] => {
    if (items.length === 0 || totalCells === 0) return [];
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, totalCells);
  };

  // Store current board in state, initialized using regenerateBoard
  const [bingoCells, setBingoCells] = useState<ChecklistItem[]>(() =>
    regenerateBoard()
  );

  // Auto-regenerate board if items are added/removed
  if (bingoCells.length !== totalCells) {
    setBingoCells(regenerateBoard());
  }

  if (maxGridSize === 0) return null;

  // Detect completed lines (row, column, diagonal)
  const getCompletedLines = (): number[][] => {
    const checked = bingoCells.map((cell) =>
      items.find((i) => i.id === cell.id)?.checked ?? false
    );

    const lines: number[][] = [];

    // Rows
    for (let r = 0; r < maxGridSize; r++) {
      const row = Array.from({ length: maxGridSize }, (_, c) => r * maxGridSize + c);
      if (row.every((i) => checked[i])) lines.push(row);
    }

    // Columns
    for (let c = 0; c < maxGridSize; c++) {
      const col = Array.from({ length: maxGridSize }, (_, r) => r * maxGridSize + c);
      if (col.every((i) => checked[i])) lines.push(col);
    }

    // Diagonals
    const diag1 = Array.from({ length: maxGridSize }, (_, i) => i * maxGridSize + i);
    if (diag1.every((i) => checked[i])) lines.push(diag1);
    const diag2 = Array.from({ length: maxGridSize }, (_, i) => i * maxGridSize + (maxGridSize - 1 - i));
    if (diag2.every((i) => checked[i])) lines.push(diag2);

    return lines;
  };

  const completedLines = getCompletedLines();

  const isCellInCompletedLine = (index: number) =>
    completedLines.some((line) => line.includes(index));

  return (
    <div className="bingo-container">
      <div className="bingo-header">
        <h2>Bingo Board</h2>
        <div>
          <button className="bingo-toggle" onClick={() => setBingoOpen(!bingoOpen)}>
            {bingoOpen ? "Collapse" : "Expand"}
          </button>
          <button
            className="bingo-toggle"
            style={{ marginLeft: "8px" }}
            onClick={() => setBingoCells(regenerateBoard())}
          >
            Regenerate Board
          </button>
          <button
            className="bingo-toggle"
            style={{ marginLeft: "8px" }}
            onClick={() => setShowIds((prev) => !prev)}
          >
            {showIds ? "Hide IDs" : "Show IDs"}
          </button>
        </div>
      </div>

      {bingoOpen && (
        <div
          className="bingo-board"
          style={{ gridTemplateColumns: `repeat(${maxGridSize}, 1fr)` }}
        >
          {bingoCells.map((cell, idx) => {
            const current = items.find((i) => i.id === cell.id) ?? cell;
            const highlight = isCellInCompletedLine(idx) ? "line" : "";
            return (
              <div
                key={current.id}
                className={`bingo-cell ${current.checked ? "checked" : ""} ${highlight}`}
              >
                {showIds && <div className="bingo-label">{current.id}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
