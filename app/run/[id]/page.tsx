"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import type { GuguApp } from "@/lib/data";
import { fetchApp } from "@/lib/catalog";
import { labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import { markPlayed } from "@/lib/storage";

// 전체 화면 게임방 — 게임이 화면 가득 열리고, 왼쪽 위 버튼으로 언제든 돌아갑니다.
// 새 창을 열지 않기 때문에 휴대폰 뒤로 가기·브라우저 뒤로 가기도 자연스럽게 작동해요.
export default function RunPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [app, setApp] = useState<GuguApp | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const found = await fetchApp(params.id);
      if (!alive) return;
      setApp(found);
      setReady(true);
      if (found?.url) markPlayed(found.id); // "해본 것" 기록은 여기서 한 번만
    })();
    return () => {
      alive = false;
    };
  }, [params.id]);

  // 돌아가기 — 직전 화면으로. (링크로 바로 들어온 경우엔 홈으로)
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: colors.surface,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 얇은 상단 바 — 돌아가기 + 제목 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          background: colors.mocha,
          flexShrink: 0,
        }}
      >
        <button
          onClick={goBack}
          style={{
            height: 40,
            padding: "0 16px",
            borderRadius: 20,
            border: "none",
            background: colors.surface,
            color: colors.text,
            fontSize: font.body,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          ← 돌아가기
        </button>
        <p
          style={{
            flex: 1,
            minWidth: 0,
            margin: 0,
            fontSize: font.body,
            fontWeight: 600,
            color: colors.text,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {app ? app.title : ""}
        </p>
        {/* 오른쪽 자리를 돌아가기 버튼과 같은 폭으로 비워서 제목이 정확히 가운데에 옵니다 */}
        <span style={{ width: 116, flexShrink: 0 }} aria-hidden="true" />
      </div>

      {!ready ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Pigeon size={90} mood="hello" />
          <p style={{ fontSize: font.body, color: colors.textSub }}>잠깐만요 구구...</p>
        </div>
      ) : app && app.url ? (
        <iframe
          src={app.url}
          title={app.title}
          style={{ flex: 1, width: "100%", border: "none", background: colors.surface }}
        />
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 20, textAlign: "center" }}>
          <Pigeon size={90} mood="empty" />
          <p style={{ margin: 0, fontSize: font.body, color: colors.text }}>
            {app ? labels.demoNotReady : labels.notFound}
          </p>
          <RunButton label="홈으로" onClick={() => router.push("/")} />
        </div>
      )}
    </div>
  );
}
