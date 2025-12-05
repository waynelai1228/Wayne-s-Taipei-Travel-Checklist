import type { ChecklistItem } from "../types/ChecklistItem";
import { getImage } from "./indexedDB";

export async function exportChecklist(items: ChecklistItem[]) {
  const images: Record<string, string> = {};

  for (const item of items) {
    const blob = await getImage(item.id.toString());
    if (blob) {
      const base64 = await blobToBase64(blob);
      images[item.id] = base64;
    }
  }

  return {
    items,
    images
  };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
