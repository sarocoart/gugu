"use client";

import { useRouter } from "next/navigation";
import type { GuguApp } from "@/lib/data";
import { categories, labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";

// 큰 그림 카드 — 홈·구경 화면에서 사용합니다.
// 카드 전체가 버튼이라 어디를 눌러도 실행 화면으로 이동해요 (아이·어르신 배려).
// 썸네일: image 주소가 있으면 그림을, 없으면 이모지를 크게 보여줍니다.
export default function AppCard({ app }: { app: GuguApp }) {
  const router = useRouter();
  const cat = categories.find((c) => c.id === app.category);
  // 올린 지 7일 안이면 NEW 배지를 붙입니다.
  const isNew = app.createdAt !== undefined && Date.now() - app.createdAt < 7 * 24 * 60 * 60 * 1000;

  return (
    <button
      onClick={() => router.push(`/play/${app.id}`)}
      aria-label={`${app.title} ${labels.run}`}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: colors.surface,
        borderRadius: 20,
        border: `1px solid ${colors.line}`,
        padding: 0,
        overflow: "hidden",
        cursor: "pointer",
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
          <img
            src={app.image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 64 }}>{app.emoji}</span>
        )}
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{ margin: 0, fontSize: font.sub, color: colors.mintText, fontWeight: 600 }}>
          {cat ? `${cat.icon} ${cat.name}` : ""}
          {app.minutes ? ` · ${app.minutes}분` : ""}
        </p>
        <p
          style={{
            margin: "4px 0 10px",
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
        <span
          style={{
            display: "inline-block",
            padding: "10px 22px",
            borderRadius: 22,
            background: colors.orange,
            color: "#FFFFFF",
            fontSize: font.body,
            fontWeight: 600,
          }}
        >
          {labels.run}
        </span>
      </div>
    </button>
  );
}
