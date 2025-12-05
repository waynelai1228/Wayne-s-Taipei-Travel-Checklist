// src/utils/import.ts
import type { ChecklistItem } from "../types/ChecklistItem";
import { normalizeScore } from "./input_utils";
import { saveImage } from "./indexedDB";

// ----------------------------
// Public Import Function
// ----------------------------
export async function importChecklist(json: string): Promise<ChecklistItem[]> {
  const parsed = JSON.parse(json);

  let itemsRaw: any[] = [];
  let images: Record<string, string> = {};

  // New format
  if (parsed.items && Array.isArray(parsed.items)) {
    itemsRaw = parsed.items;
    images = parsed.images || {};
  }
  // Old format
  else if (Array.isArray(parsed)) {
    itemsRaw = parsed;
  } else {
    throw new Error("Invalid import JSON structure.");
  }

  // Restore images
  for (const id in images) {
    const blob = base64ToBlob(images[id]);
    await saveImage(id, blob);
  }

  // Validate & normalize items
  const validatedItems: ChecklistItem[] = itemsRaw.map(
    (i: ChecklistItem, index: number) => ({
      id: typeof i.id === "number" ? i.id : Date.now() + index,
      label: typeof i.label === "string" ? i.label : "Untitled Item",
      checked: typeof i.checked === "boolean" ? i.checked : false,
      notes: typeof i.notes === "string" ? i.notes : "",

      scenicScore: normalizeScore(i.scenicScore),
      romanceScore: normalizeScore(i.romanceScore),
      educationalScore: normalizeScore(i.educationalScore),
      convenienceScore: normalizeScore(i.convenienceScore),
      imageVersion: (i.imageVersion ?? 0) + 1,
    })
  );

  return validatedItems;
}

// ----------------------------
// Helper
// ----------------------------
function base64ToBlob(base64: string): Blob {
  const [header, data] = base64.split(",");
  const mime =
    header.match(/data:(.*?);/)?.[1] || "image/png";

  const binary = atob(data);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mime });
}
