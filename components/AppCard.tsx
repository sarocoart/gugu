"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { GuguApp } from "@/lib/data";
import { categories, labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import { isSaved, toggleSaved } from "@/lib/storage";

// 큰 그림 카드 — 홈 화면에서 사용합니다.
// 그림/제목을 누르면 실행 화면으로, 아래에는 "게임 GO!"와 "담기" 버튼이 있어요.
export default function AppCard({ app }: { app: GuguApp }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const cat = categories.find((c) => c.id === app.category);

  // "게임 GO!", "테스트 GO!" 처럼 종류에 맞는 버튼 글자
  const goLabel = cat ? `${cat.name} GO!` : "GO!";

  // 올린 지 7일 안이면 NEW 배지
  const isNew = app.createdAt !== undefined && Date.now() - app.createdAt < 7 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    setSaved(isSaved(app.id));
  }, [app.id]);

  const goPlay = () => router.push(`/play/${app.id}`);

  return (
    <div
      style={{
        background: colors.surface,
        borderRadius: 20,
        border: `1px solid ${colors.line}`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {isNew && (
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "4px 10px",
            borderRadius: 12,
            background: colors.orange,
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: 700,
            zIndex: 1,
          }}
        >
          NEW
        </span>
      )}

      {/* 그림과 제목 — 누르면 실행 화면으로 */}
      <button
        onClick={goPlay}
        aria-label={`${app.title} 실행 화면 열기`}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "100%",
            aspectRatio: "1 / 0.85",
            background: colors.mint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {app.image ? (
            <img src={app.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 64 }}>{app.emoji}</span>
          )}
        </div>
        <div style={{ padding: "12px 14px 0" }}>
          <p style={{ margin: 0, fontSize: font.sub, color: colors.mintText, fontWeight: 600 }}>
            {cat ? `${cat.icon} ${cat.name}` : ""}
            {app.minutes ? ` · ${app.minutes}분` : ""}
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: font.cardTitle,
              fontWeight: 600,
              color: colors.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {app.title}
          </p>
        </div>
      </button>

      {/* GO! 버튼과 담기 버튼 */}
      <div style={{ display: "flex", gap: 8, padding: "10px 14px 14px" }}>
        <button
          onClick={goPlay}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 24,
            border: "none",
            background: colors.orange,
            color: "#FFFFFF",
            fontSize: font.button,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {goLabel}
        </button>
        <button
          onClick={() => setSaved(toggleSaved(app.id))}
          aria-label={saved ? labels.unsave : labels.save}
          style={{
            height: 48,
            padding: "0 14px",
            borderRadius: 24,
            border: saved ? "none" : `1px solid ${colors.line}`,
            background: saved ? colors.orangeSoft : colors.surface,
            color: saved ? colors.orangeText : colors.textSub,
            fontSize: font.body,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {saved ? `💛 ${labels.savedDone}` : `🤍 ${labels.save}`}
        </button>
      </div>
    </div>
  );
}
