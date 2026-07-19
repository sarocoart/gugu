// 서버(Supabase) 연결 — 빌트마켓과 "같은 서버"를 씁니다.
// 그래서 빌트마켓 계정으로 구구마켓에 그대로 로그인할 수 있어요.
//
// 주소와 열쇠를 코드에 직접 넣었습니다. Vercel 환경 변수 설정이 필요 없어요.
// 여기 넣은 anon 열쇠는 "공개용"이라 코드에 넣어도 안전합니다
// (Supabase가 브라우저에서 써도 된다고 안내하는 바로 그 열쇠예요).
// ⚠️ 단, service_role(secret) 열쇠는 절대 여기에 넣으면 안 됩니다.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = "https://pwxbtweildwptcsspmzt.supabase.co";
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3eGJ0d2VpbGR3cHRjc3NwbXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MjM1ODcsImV4cCI6MjA5ODk5OTU4N30.SiqSak7JfYTpmLnzYeLAZtNYj5eicGS-GuZ3zTkjPq8";

export const supabase: SupabaseClient | null = createClient(url, key);

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
