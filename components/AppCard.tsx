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
