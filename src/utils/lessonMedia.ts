const DB_NAME = "dd-academy-media";
const STORE_NAME = "files";
const DB_VERSION = 1;

export type StoredMediaFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  createdAt: string;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME))
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ??
          new Error("No se pudo abrir el almacenamiento de medios"),
      );
  });
}

export async function storeMediaFile(file: File): Promise<StoredMediaFile> {
  if (navigator.storage?.persist)
    await navigator.storage.persist().catch(() => false);
  const database = await openDatabase();
  const stored: StoredMediaFile = {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type,
    size: file.size,
    blob: file,
    createdAt: new Date().toISOString(),
  };
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(stored);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("No se pudo guardar el archivo"));
  });
  database.close();
  return stored;
}

export async function getMediaFile(
  id: string,
): Promise<StoredMediaFile | null> {
  const database = await openDatabase();
  const result = await new Promise<StoredMediaFile | undefined>(
    (resolve, reject) => {
      const request = database
        .transaction(STORE_NAME, "readonly")
        .objectStore(STORE_NAME)
        .get(id);
      request.onsuccess = () =>
        resolve(request.result as StoredMediaFile | undefined);
      request.onerror = () =>
        reject(request.error ?? new Error("No se pudo recuperar el archivo"));
    },
  );
  database.close();
  return result ?? null;
}

export async function removeMediaFile(id: string): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("No se pudo eliminar el archivo"));
  });
  database.close();
}

export const localMediaUrl = (id: string) => `local-media:${id}`;
export const localMediaId = (url?: string) =>
  url?.startsWith("local-media:") ? url.slice("local-media:".length) : null;
