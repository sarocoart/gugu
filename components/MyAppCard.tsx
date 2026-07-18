"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GuguApp } from "@/lib/data";
import { categories, labels, runLabel } from "@/lib/labels";
import { colors, font } from "@/lib/theme";

// "내가 올린 것" 전용 카드.
// 위: 그림·제목·통계·GO!  /  아래: 수정 · 숨기기 · 삭제 버튼 줄.
export default function MyAppCard({
  app,
  statsText,
  onEdit,
  onToggleHide,
  onRemove,
}: {
  app: GuguApp;
  statsText: string;
  onEdit: (id: string) => void;
  onToggleHide: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const cat = categories.find((c) => c.id === app.category);

  // 아래 줄의 연한 버튼 공통 모양
  const actionStyle = {
    flex: 1,
    height: 44,
    borderRadius: 14,
    border: `1px solid ${colors.line}`,
    background: colors.surface,
    color: colors.text,
    fontSize: font.sub,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  } as const;

  return (
    <div
      style={{
        background: colors.surface,
        borderRadius: 18,
        padding: 14,
        border: `1px solid ${colors.line}`,
        opacity: app.hidden ? 0.75 : 1,
      }}
    >
      {/* 윗줄: 그림 · 제목/통계 · GO! */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          aria-hidden="true"
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: colors.mint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            flexShrink: 0,
            overflow: "hidden",
            filter: app.hidden ? "grayscale(60%)" : "none",
          }}
        >
          {app.image ? (
            <img src={app.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            app.emoji
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: font.cardTitle,
              fontWeight: 600,
              color: colors.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {app.title}
            {app.hidden && (
              <span
                style={{
                  marginLeft: 8,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: colors.mocha,
                  color: colors.textSub,
                  fontSize: 12,
                  fontWeight: 700,
                  verticalAlign: "middle",
                }}
              >
                숨김
              </span>
            )}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: font.sub, color: colors.textSub, whiteSpace: "nowrap" }}>
            {cat ? `${cat.icon} ${cat.name}` : ""}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: font.sub,
              color: colors.orangeText,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {statsText}
          </p>
        </div>
        <button
          onClick={() => router.push(`/play/${app.id}`)}
          style={{
            height: 48,
            padding: "0 20px",
            borderRadius: 24,
            border: "none",
            background: colors.orange,
            color: "#FFFFFF",
            fontSize: font.button,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {runLabel(app.category)}
        </button>
      </div>

      {/* 아랫줄: 수정 · 숨기기/보이기 · 삭제 */}
      {confirming ? (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${colors.line}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ flex: 1, fontSize: font.body, color: colors.text, fontWeight: 600 }}>
            {labels.removeConfirm}
          </span>
          <button
            onClick={() => setConfirming(false)}
            style={{
              height: 44,
              padding: "0 18px",
              borderRadius: 22,
              border: `1px solid ${colors.line}`,
              background: colors.surface,
              color: colors.textSub,
              fontSize: font.body,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {labels.cancel}
          </button>
          <button
            onClick={() => onRemove(app.id)}
            style={{
              height: 44,
              padding: "0 18px",
              borderRadius: 22,
              border: "none",
              background: "#E24B4A",
              color: "#FFFFFF",
              fontSize: font.body,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {labels.remove}
          </button>
        </div>
      ) : (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${colors.line}`,
            display: "flex",
            gap: 8,
          }}
        >
          <button onClick={() => onEdit(app.id)} style={actionStyle}>
            ✏️ 수정
          </button>
          <button onClick={() => onToggleHide(app.id)} style={actionStyle}>
            {app.hidden ? "👁️ 보이기" : "🙈 숨기기"}
          </button>
          <button
            onClick={() => setConfirming(true)}
            style={{ ...actionStyle, color: "#C0392B" }}
          >
            🗑️ 삭제
          </button>
        </div>
      )}
    </div>
  );
}
