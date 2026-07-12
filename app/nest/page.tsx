"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import AppCard from "@/components/AppCard";
import RunButton from "@/components/RunButton";
import { apps } from "@/lib/data";
import { labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import { getSaved, getPlayed } from "@/lib/storage";

type Tab = "saved" | "played";

export default function NestPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("saved");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [playedIds, setPlayedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(getSaved());
    setPlayedIds(getPlayed());
  }, []);

  const ids = tab === "saved" ? savedIds : playedIds;
  const list = ids
    .map((id) => apps.find((a) => a.id === id))
    .filter((a): a is (typeof apps)[number] => Boolean(a));

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

      <div style={{ display: "flex", gap: 10, padding: 16 }}>
        <button style={tabStyle(tab === "saved")} onClick={() => setTab("saved")}>
          💛 {labels.saved} {savedIds.length > 0 ? savedIds.length : ""}
        </button>
        <button style={tabStyle(tab === "played")} onClick={() => setTab("played")}>
          ▶️ {labels.played} {playedIds.length > 0 ? playedIds.length : ""}
        </button>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <Pigeon size={80} mood="empty" />
          <p style={{ fontSize: font.body, color: colors.text, margin: "12px 0 16px" }}>
            {tab === "saved" ? labels.emptyNest : labels.emptyPlayed}
          </p>
          <RunButton label={`${labels.explore} 가기`} onClick={() => router.push("/explore")} />
        </div>
      ) : (
        <div className="gugu-list" style={{ padding: "0 16px" }}>
          {list.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
