// 담기/해본 것 기록을 브라우저(localStorage)에 저장합니다.
// 나중에 Supabase를 붙일 때 이 파일의 함수 속만 바꾸면 앱 전체가 그대로 따라옵니다.

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

export function getPlayed(): string[] {
  return read(PLAYED_KEY);
}

export function markPlayed(id: string) {
  const ids = read(PLAYED_KEY).filter((x) => x !== id);
  write(PLAYED_KEY, [id, ...ids]);
}
