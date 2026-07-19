// 서버(Supabase) 연결 — 빌트마켓과 "같은 서버"를 씁니다.
// 그래서 빌트마켓 계정으로 구구마켓에 그대로 로그인할 수 있어요.
//
// 연결 방법: Vercel의 gugu 프로젝트 → Settings → Environment Variables 에
// 아래 두 값을 등록하면 켜집니다 (빌트마켓 프로젝트에 있는 값과 동일하게):
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
// 값을 아직 안 넣었으면 로그인 기능만 "준비 중"으로 표시되고, 나머지는 평소처럼 동작합니다.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 값이 없으면 null — 화면들은 null 여부로 "서버 연결 전" 상태를 알 수 있어요.
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

// 로그인한 사용자 정보 (간단 버전)
export type GuguUser = {
  id: string;
  email: string;
  nickname: string;
};

// 현재 로그인한 사용자를 가져옵니다. 없거나 서버 연결 전이면 null.
export async function getCurrentUser(): Promise<GuguUser | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getUser();
    const u = data.user;
    if (!u) return null;
    const meta = (u.user_metadata ?? {}) as { nickname?: string };
    return {
      id: u.id,
      email: u.email ?? "",
      nickname: meta.nickname ?? u.email?.split("@")[0] ?? "손님",
    };
  } catch {
    return null;
  }
}
