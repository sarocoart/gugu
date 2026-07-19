"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import AppCard from "@/components/AppCard";
import MyAppCard from "@/components/MyAppCard";
import SuggestCard from "@/components/SuggestCard";
import RunButton from "@/components/RunButton";
import type { GuguApp } from "@/lib/data";
import { findApp, getAllApps } from "@/lib/catalog";
import { labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import {
  getSaved,
  getPlayed,
  getMyApps,
  removeSaved,
  removePlayed,
  removeMyApp,
  addSaved,
  clearSaved,
  clearPlayed,
  clearMyApps,
  getViews,
  toggleHideMyApp,
} from "@/lib/storage";
import { supabase, getCurrentUser, type GuguUser } from "@/lib/supabase";

type Tab = "saved" | "played" | "mine";
type MineSort = "recent" | "views" | "saves"; // 내가 올린 것 정렬: 최신순/조회순/담김순

export default function NestPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("saved");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [playedIds, setPlayedIds] = useState<string[]>([]);
  const [myApps, setMyApps] = useState<GuguApp[]>([]);
  const [allApps, setAllApps] = useState<GuguApp[]>([]);
  const [views, setViews] = useState<Record<string, number>>({});
  const [mineSort, setMineSort] = useState<MineSort>("recent");
  const [clearing, setClearing] = useState(false); // "전체 비우기" 확인창 표시 여부
  const [user, setUser] = useState<GuguUser | null>(null); // 로그인한 사용자 (서버 연결 후)

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const logout = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
    } catch {
      // 무시
    }
    setUser(null);
  };

  // 저장소에서 현재 상태를 다시 읽어옵니다 (담기/삭제 후에도 호출).
  const refresh = () => {
    setSavedIds(getSaved());
    setPlayedIds(getPlayed());
    setMyApps(getMyApps());
    setAllApps(getAllApps());
    setViews(getViews());
  };

  useEffect(() => {
    refresh();
  }, []);

  // 탭이 바뀌면 확인창은 닫습니다.
  const switchTab = (t: Tab) => {
    setTab(t);
    setClearing(false);
  };

  // 현재 탭에 보여줄 작품 목록
  let list: GuguApp[] = [];
  if (tab === "saved") {
    list = savedIds.map((id) => findApp(id)).filter((a): a is GuguApp => Boolean(a));
  } else if (tab === "played") {
    list = playedIds.map((id) => findApp(id)).filter((a): a is GuguApp => Boolean(a));
  } else {
    // 내가 올린 것 — 고른 순위 기준으로 정렬합니다.
    const savedNum = (id: string) => (savedIds.includes(id) ? 1 : 0);
    const viewNum = (id: string) => views[id] ?? 0;
    list = [...myApps];
    if (mineSort === "views") list.sort((a, b) => viewNum(b.id) - viewNum(a.id));
    else if (mineSort === "saves") list.sort((a, b) => savedNum(b.id) - savedNum(a.id));
    // recent는 저장된 순서(최신이 앞) 그대로
  }

  // 탭마다 지우는 곳이 다릅니다.
  const handleRemove = (id: string) => {
    if (tab === "saved") removeSaved(id);
    else if (tab === "played") removePlayed(id);
    else removeMyApp(id);
    refresh();
  };

  // 현재 탭 전체 비우기
  const handleClearAll = () => {
    if (tab === "saved") clearSaved();
    else if (tab === "played") clearPlayed();
    else clearMyApps();
    setClearing(false);
    refresh();
  };

  // 아래 추천 목록: 아직 담지 않은 작품들 (최대 6개)
  const suggestions = allApps.filter((a) => !savedIds.includes(a.id)).slice(0, 6);

  const handleAdd = (id: string) => {
    addSaved(id);
    refresh();
  };

  const tabStyle = (active: boolean) => ({
    flex: 1,
    height: 52,
    borderRadius: 16,
    border: "none",
    background: active ? colors.orangeSoft : colors.surface,
    color: active ? colors.orangeText : colors.text,
    fontSize: font.body,
    fontWeight: 600,
    cursor: "pointer",
  });

  const emptyText =
    tab === "saved" ? labels.emptyNest : tab === "played" ? labels.emptyPlayed : "아직 올린 작품이 없구구!";

  return (
    <div>
      <header
        style={{
          background: colors.mocha,
          padding: "24px 20px",
          textAlign: "center",
          borderRadius: "0 0 28px 28px",
        }}
      >
        <Pigeon size={80} mood={list.length > 0 ? "party" : "hello"} />
        <h1 style={{ margin: "8px 0 0", fontSize: font.title, fontWeight: 700, color: colors.text }}>
          {labels.mypage}
        </h1>
        {/* 로그인 상태 — 서버 연결 후 활성화됩니다 */}
        {supabase && (
          <div style={{ marginTop: 12 }}>
            {user ? (
              <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
                <span style={{ fontSize: font.body, color: colors.text, fontWeight: 600 }}>
                  🕊️ {user.nickname}님
                </span>
                <button
                  onClick={logout}
                  style={{
                    height: 40,
                    padding: "0 14px",
                    borderRadius: 20,
                    border: `1px solid ${colors.line}`,
                    background: colors.surface,
                    color: colors.textSub,
                    fontSize: font.sub,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                style={{
                  height: 44,
                  padding: "0 20px",
                  borderRadius: 22,
                  border: "none",
                  background: colors.orangeSoft,
                  color: colors.orangeText,
                  fontSize: font.body,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                로그인 · 빌트마켓 계정 사용 가능
              </button>
            )}
          </div>
        )}
      </header>

      <div style={{ display: "flex", gap: 8, padding: 16 }}>
        <button style={tabStyle(tab === "saved")} onClick={() => switchTab("saved")}>
          💛 {labels.saved} {savedIds.length > 0 ? savedIds.length : ""}
        </button>
        <button style={tabStyle(tab === "played")} onClick={() => switchTab("played")}>
          ▶️ {labels.played} {playedIds.length > 0 ? playedIds.length : ""}
        </button>
        <button style={tabStyle(tab === "mine")} onClick={() => switchTab("mine")}>
          ✨ {labels.myUploads} {myApps.length > 0 ? myApps.length : ""}
        </button>
      </div>

      <div style={{ padding: "0 16px 12px" }}>
        <RunButton wide label={`＋ ${labels.uploadButton}`} onClick={() => router.push("/upload")} />
      </div>

      {/* 내가 올린 것 탭에서만 보이는 순위 정렬 */}
      {tab === "mine" && myApps.length > 0 && (
        <div style={{ display: "flex", gap: 8, padding: "0 16px 10px", alignItems: "center" }}>
          <span style={{ fontSize: font.sub, color: colors.textSub, fontWeight: 600 }}>순위 보기:</span>
          {(
            [
              { id: "recent", name: "최신순" },
              { id: "views", name: "조회순" },
              { id: "saves", name: "💛 담김순" },
            ] as { id: MineSort; name: string }[]
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setMineSort(s.id)}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 20,
                border: mineSort === s.id ? "none" : `1px solid ${colors.line}`,
                background: mineSort === s.id ? colors.orangeSoft : colors.surface,
                color: mineSort === s.id ? colors.orangeText : colors.textSub,
                fontSize: font.sub,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* 목록이 있을 때만 "전체 비우기"가 보입니다 */}
      {list.length > 0 && (
        <div style={{ padding: "0 16px 10px", display: "flex", justifyContent: "flex-end" }}>
          {clearing ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: font.body, color: colors.text, fontWeight: 600 }}>
                모두 지울까요?
              </span>
              <button
                onClick={() => setClearing(false)}
                style={{
                  height: 40,
                  padding: "0 16px",
                  borderRadius: 20,
                  border: `1px solid ${colors.line}`,
                  background: colors.surface,
                  color: colors.textSub,
                  fontSize: font.sub,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {labels.cancel}
              </button>
              <button
                onClick={handleClearAll}
                style={{
                  height: 40,
                  padding: "0 16px",
                  borderRadius: 20,
                  border: "none",
                  background: "#E24B4A",
                  color: "#FFFFFF",
                  fontSize: font.sub,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                모두 지우기
              </button>
            </div>
          ) : (
            <button
              onClick={() => setClearing(true)}
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 20,
                border: `1px solid ${colors.line}`,
                background: colors.surface,
                color: colors.textSub,
                fontSize: font.sub,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🗑️ 전체 비우기
            </button>
          )}
        </div>
      )}

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 20px" }}>
          <Pigeon size={80} mood="empty" />
          <p style={{ fontSize: font.body, color: colors.text, margin: "12px 0 0" }}>{emptyText}</p>
        </div>
      ) : (
        <div className={tab === "mine" ? "gugu-list" : "gugu-grid"} style={{ padding: "0 16px" }}>
          {list.map((app) =>
            tab === "mine" ? (
              <MyAppCard
                key={app.id}
                app={app}
                statsText={`조회 ${views[app.id] ?? 0} · 💛 담김 ${savedIds.includes(app.id) ? 1 : 0}`}
                onEdit={(id) => router.push(`/upload?edit=${id}`)}
                onToggleHide={(id) => {
                  toggleHideMyApp(id);
                  refresh();
                }}
                onRemove={handleRemove}
              />
            ) : (
              <AppCard key={app.id} app={app} onRemove={handleRemove} onSavedChange={refresh} />
            )
          )}
        </div>
      )}

      {/* 아래 추천 목록 — 아직 안 담은 작품을 바로 담을 수 있어요 */}
      {suggestions.length > 0 && (
        <section style={{ padding: "24px 16px 8px" }}>
          <h2 style={{ margin: "0 4px 12px", fontSize: font.cardTitle, fontWeight: 700, color: colors.text }}>
            이런 것도 담아 보세요
          </h2>
          <div className="gugu-list">
            {suggestions.map((app) => (
              <SuggestCard key={app.id} app={app} onAdd={handleAdd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
