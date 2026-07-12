// 담기/해본 것/내가 올린 작품을 브라우저(localStorage)에 저장합니다.
// 나중에 Supabase를 붙일 때 이 파일의 함수 속만 바꾸면 앱 전체가 그대로 따라옵니다.
import type { GuguApp } from "./data";

// ---- 문자열 목록(담은 것/해본 것) 공용 읽기·쓰기 ----
function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // 저장이 안 되는 환경(사생활 모드 등)에서도 앱이 죽지 않게 조용히 넘어갑니다.
  }
}

const SAVED_KEY = "gugu_saved";
const PLAYED_KEY = "gugu_played";
const MYAPPS_KEY = "gugu_myapps";

// ---- 담은 것 ----
export function getSaved(): string[] {
  return read(SAVED_KEY);
}

export function isSaved(id: string): boolean {
  return read(SAVED_KEY).includes(id);
}

export function toggleSaved(id: string): boolean {
  const ids = read(SAVED_KEY);
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids];
  write(SAVED_KEY, next);
  return next.includes(id);
}

// 담은 것에서 하나 빼기 (내 둥지 삭제 버튼용)
export function removeSaved(id: string) {
  write(SAVED_KEY, read(SAVED_KEY).filter((x) => x !== id));
}

// ---- 해본 것 ----
export function getPlayed(): string[] {
  return read(PLAYED_KEY);
}

export function markPlayed(id: string) {
  const ids = read(PLAYED_KEY).filter((x) => x !== id);
  write(PLAYED_KEY, [id, ...ids]);
}

// 해본 것에서 하나 빼기 (내 둥지 삭제 버튼용)
export function removePlayed(id: string) {
  write(PLAYED_KEY, read(PLAYED_KEY).filter((x) => x !== id));
}

// ---- 내가 올린 작품 ----
// 작품 객체 전체를 저장합니다(문자열 목록과 달라서 별도 함수).
export function getMyApps(): GuguApp[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MYAPPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addMyApp(app: GuguApp) {
  if (typeof window === "undefined") return;
  try {
    const list = getMyApps().filter((a) => a.id !== app.id);
    window.localStorage.setItem(MYAPPS_KEY, JSON.stringify([app, ...list]));
  } catch {
    // 저장 실패해도 앱이 죽지 않게 넘어갑니다.
  }
}

export function removeMyApp(id: string) {
  if (typeof window === "undefined") return;
  try {
    const list = getMyApps().filter((a) => a.id !== id);
    window.localStorage.setItem(MYAPPS_KEY, JSON.stringify(list));
  } catch {
    // 무시
  }
}
