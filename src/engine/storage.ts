/**
 * Persistence: localStorage always; optionally a linked progress.json on disk via the
 * File System Access API (Chrome/Edge); export/import everywhere.
 */
import { normalize, serialize, type ProgressState } from "./state";

const LS_KEY = "the-ai-engineer/progress";

export function loadLocal(): ProgressState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? normalize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}
export function saveLocal(s: ProgressState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { /* storage full or blocked */ }
}

/* ---------- IndexedDB for the file handle ---------- */
function idb(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open("the-ai-engineer", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function kv<T>(mode: "get" | "put" | "del", key: string, val?: T): Promise<T | undefined> {
  try {
    const db = await idb();
    return await new Promise(res => {
      const store = db.transaction("kv", mode === "get" ? "readonly" : "readwrite").objectStore("kv");
      const req = mode === "get" ? store.get(key) : mode === "del" ? store.delete(key) : store.put(val, key);
      req.onsuccess = () => res(req.result as T);
      req.onerror = () => res(undefined);
    });
  } catch {
    return undefined;
  }
}

/* ---------- File System Access (typed loosely; not in all TS DOM libs) ---------- */
type PermState = "granted" | "denied" | "prompt";
export interface FileHandle {
  name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<{ write(data: string): Promise<void>; close(): Promise<void> }>;
  queryPermission(o: { mode: "readwrite" }): Promise<PermState>;
  requestPermission(o: { mode: "readwrite" }): Promise<PermState>;
}
type PickerWindow = Window & {
  showOpenFilePicker?: (o: unknown) => Promise<FileHandle[]>;
  showSaveFilePicker?: (o: unknown) => Promise<FileHandle>;
};

export const fsSupported = () => typeof window !== "undefined" && "showSaveFilePicker" in window;

const pickerTypes = [{ description: "Progress JSON", accept: { "application/json": [".json"] } }];

export async function pickExistingFile(): Promise<FileHandle | null> {
  const w = window as PickerWindow;
  if (!w.showOpenFilePicker) return null;
  const [h] = await w.showOpenFilePicker({ types: pickerTypes, multiple: false });
  return h ?? null;
}
export async function pickNewFile(): Promise<FileHandle | null> {
  const w = window as PickerWindow;
  if (!w.showSaveFilePicker) return null;
  return w.showSaveFilePicker({ suggestedName: "progress.json", types: pickerTypes });
}

export async function readHandle(h: FileHandle): Promise<ProgressState | null> {
  const text = await (await h.getFile()).text();
  if (!text.trim()) return null;
  return normalize(JSON.parse(text));
}
export async function writeHandle(h: FileHandle, s: ProgressState) {
  const w = await h.createWritable();
  await w.write(serialize(s));
  await w.close();
}
export const rememberHandle = (h: FileHandle) => kv("put", "handle", h);
export const forgetHandle = () => kv("del", "handle");
export const recallHandle = () => kv<FileHandle>("get", "handle");

/* ---------- Export / import ---------- */
export function downloadJson(s: ProgressState) {
  const url = URL.createObjectURL(new Blob([serialize(s)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "progress.json";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function readUpload(file: File): Promise<ProgressState | null> {
  try { return normalize(JSON.parse(await file.text())); } catch { return null; }
}
