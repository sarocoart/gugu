// 작품 창고 — 이제 서버(Supabase)에서 작품을 읽고 씁니다.
// 그래서 어느 기기에서든, 누구에게든 같은 작품 목록이 보여요.
// 화면들은 이 파일의 함수만 쓰면 되고, 저장 방식이 바뀌어도 화면은 그대로예요.
import { supabase } from "./supabase";
import { getMyApps as getLocalMyApps, clearMyApps as clearLocalMyApps } from "./storage";
import type { GuguApp } from "./data";
import { categories } from "./labels";

// 서버 한 줄(row)을 화면용 작품 모양으로 바꿔줍니다.
function rowToApp(r: any): GuguApp {
  return {
    id: r.id,
    title: r.title,
    desc: r.desc ?? "",
    category: r.category,
    emoji: r.emoji ?? "✨",
    image: r.image ?? undefined,
    url: r.url ?? "",
    maker: r.maker,
    minutes: r.minutes ?? undefined,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : undefined,
    hidden: r.hidden ?? false,
    tags: r.tags ?? undefined,
    contact: r.contact ?? undefined,
    views: r.views ?? 0,
  };
}

// 화면용 작품을 서버 저장용 모양으로 바꿔줍니다.
function appToRow(app: GuguApp) {
  return {
    id: app.id,
    title: app.title,
    desc: app.desc,
    category: app.category,
    emoji: app.emoji,
    image: app.image ?? null,
    url: app.url,
    maker: app.maker,
    minutes: app.minutes ?? null,
    hidden: app.hidden ?? false,
    tags: app.tags ?? null,
    contact: app.contact ?? null,
  };
}

// 공개된 전체 작품 (숨긴 것 제외, 최신순)
export async function fetchAllApps(): Promise<GuguApp[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("gugu_apps")
      .select("*")
      .eq("hidden", false)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(rowToApp);
  } catch {
    return [];
  }
}

// 작품 하나 (숨긴 것도 — 주인이 확인해볼 수 있게)
export async function fetchApp(id: string): Promise<GuguApp | undefined> {
  if (!supabase) return undefined;
  try {
    const { data, error } = await supabase.from("gugu_apps").select("*").eq("id", id).maybeSingle();
    if (error || !data) return undefined;
    return rowToApp(data);
  } catch {
    return undefined;
  }
}

// 내가 올린 작품 전부 (숨긴 것 포함, 최신순)
export async function fetchMyApps(ownerId: string): Promise<GuguApp[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("gugu_apps")
      .select("*")
      .eq("owner", ownerId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(rowToApp);
  } catch {
    return [];
  }
}

// 새 작품 올리기 (로그인 필요 — 서버 규칙)
export async function insertApp(app: GuguApp): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("gugu_apps").insert(appToRow(app));
    return !error;
  } catch {
    return false;
  }
}

// 작품 고치기 (내 작품만 — 서버 규칙)
export async function updateApp(app: GuguApp): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("gugu_apps").update(appToRow(app)).eq("id", app.id);
    return !error;
  } catch {
    return false;
  }
}

// 숨기기/보이기
export async function setAppHidden(id: string, hidden: boolean): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("gugu_apps").update({ hidden }).eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

// 삭제
export async function deleteApp(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("gugu_apps").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

// 조회수 1 올리기 (누구나 가능 — 서버의 전용 함수 호출, 결과는 기다리지 않음)
export function addServerView(id: string) {
  if (!supabase) return;
  try {
    supabase.rpc("gugu_add_view", { app_id: id }).then(
      () => {},
      () => {}
    );
  } catch {
    // 무시
  }
}

// 검색 — 제목·소개·만든 사람·종류 이름·검색 단어를 모두 뒤집니다.
export function matchesQuery(app: GuguApp, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  const catName = categories.find((c) => c.id === app.category)?.name ?? "";
  const haystack = [app.title, app.desc, app.maker, catName, ...(app.tags ?? [])]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

// 예전 방식(브라우저에만 저장)으로 올린 작품이 남아 있으면 서버로 이사시킵니다.
// 로그인 상태에서 홈이나 마이 페이지를 열면 자동으로 한 번 실행돼요. (이사 후엔 할 일 없음)
export async function migrateLocalWorks(): Promise<boolean> {
  if (!supabase) return false;
  const locals = getLocalMyApps();
  if (locals.length === 0) return false;
  try {
    const { data } = await supabase.auth.getUser();
    if (!data || !data.user) return false; // 로그인해야 계정에 붙여 저장할 수 있어요
    for (const a of locals) {
      await insertApp(a); // 하나 실패해도 다음 것 진행
    }
    clearLocalMyApps();
    return true;
  } catch {
    return false;
  }
}
