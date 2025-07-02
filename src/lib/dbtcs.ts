import { openDB, DBSchema } from 'idb';

interface ExcelData {
  id?: number;
  [key: string]: any;
}

interface ExcelManagerDB extends DBSchema {
  'excel-datatcs': {
    key: number;
    value: ExcelData;
    indexes: { 'by-id': number };
  };
}

const DB_NAME = 'excel-manager-dbtcs';
const STORE_NAME = 'excel-datatcs';

export async function initDB() {
  return openDB<ExcelManagerDB>(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('by-id', 'id');
    },
  });
}

export async function addData(data: ExcelData[]) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  
  for (const item of data) {
    await store.add(item);

  }
  
  await tx.done;
}

export async function getAllData() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function updateData(id: number, data: ExcelData) {
  const db = await initDB();
  return db.put(STORE_NAME, { ...data, id });
}

export async function deleteData(id: number) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}

export async function clearAllData() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
}