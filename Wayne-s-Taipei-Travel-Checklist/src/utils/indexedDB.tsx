// utils/indexedDB.ts
import { openDB } from 'idb';

const DB_NAME = 'ChecklistDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveImage(key: string, file: Blob) {
  const db = await getDB();
  await db.put(STORE_NAME, file, key);
}

export async function getImage(key: string): Promise<Blob | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, key);
}

export async function deleteImage(key: string) {
  const db = await getDB();
  await db.delete(STORE_NAME, key);
}

export async function clearAllImages() {
  const db = await openDB("ChecklistDB", 1);
  await db.clear("images"); // clears all images
}