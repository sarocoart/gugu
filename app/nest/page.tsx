"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import NestCard from "@/components/NestCard";
import RunButton from "@/components/RunButton";
import type { GuguApp } from "@/lib/data";
import { findApp } from "@/lib/catalog";
import { labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import {
  getSaved,
  getPlayed,
  getMyApps,
  removeSaved,
  removePlayed,
  removeMyApp,
} from "@/lib/storage";

type Tab = "saved" | "played" | "mine";

export default function NestPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("saved");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [playedIds, setPlayedIds] = useState<string[]>([]);
  const [myApps, setMyApps] = useState<GuguApp[]>([]);

  // 저장소에서 현재 상태를 다시 읽어옵니다 (삭제 후에도 호출).
  const refresh = () => {
    setSavedIds(getSaved());
    setPlayedIds(getPlayed());
    setMyApps(getMyApps());
  };

  useEffect(() => {
    refresh();
  }, []);

  // 현재 탭에 보여줄 작품 목록
  let list: GuguApp[] = [];
  if (tab === "saved") {
    list = savedIds.map((id) => findApp(id)).filter((a): a is GuguApp => Boolean(a));
  } else if (tab === "played") {
    list = playedIds.map((id) => findApp(id)).filter((a): a is GuguApp => Boolean(a));
  } else {
    list = myApps;
  }

  // 탭마다 지우는 곳이 다릅니다.
  const handleRemove = (id: string) => {
    if (tab === "saved") removeSaved(id);
    else if (tab === "played") removePlayed(id);
    else removeMyApp(id);
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
      </header>

      <div style={{ display: "flex", gap: 8, padding: 16 }}>
        <button style={tabStyle(tab === "saved")} onClick={() => setTab("saved")}>
          💛 {labels.saved} {savedIds.length > 0 ? savedIds.length : ""}
        </button>
        <button style={tabStyle(tab === "played")} onClick={() => setTab("played")}>
          ▶️ {labels.played} {playedIds.length > 0 ? playedIds.length : ""}
        </button>
        <button style={tabStyle(tab === "mine")} onClick={() => setTab("mine")}>
          ✨ {labels.myUploads} {myApps.length > 0 ? myApps.length : ""}
        </button>
      </div>

      <div style={{ padding: "0 16px 12px" }}>
        <RunButton wide label={`＋ ${labels.uploadButton}`} onClick={() => router.push("/upload")} />
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <Pigeon size={80} mood="empty" />
          <p style={{ fontSize: font.body, color: colors.text, margin: "12px 0 16px" }}>{emptyText}</p>
          {tab !== "mine" && (
            <RunButton label="작품 보러 가기" onClick={() => router.push("/")} />
          )}
        </div>
      ) : (
        <div className="gugu-list" style={{ padding: "0 16px" }}>
          {list.map((app) => (
            <NestCard key={app.id} app={app} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
