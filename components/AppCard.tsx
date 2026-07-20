"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { GuguApp } from "@/lib/data";
import { categories, labels, runLabel } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import { isSaved, toggleSaved } from "@/lib/storage";
import { addServerView } from "@/lib/catalog";

// 큰 그림 카드 — 홈과 내 둥지(담은 것/해본 것)에서 함께 씁니다.
// 제목은 가운데 정렬, 담기는 하트 색과 숫자로 표시합니다.
// onRemove를 넘기면 오른쪽 위에 빼기(✕) 버튼이 생깁니다 (내 둥지용).
export default function AppCard({
  app,
  onRemove,
  onSavedChange,
}: {
  app: GuguApp;
  onRemove?: (id: string) => void;
  onSavedChange?: () => void;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [removing, setRemoving] = useState(false); // ✕ 두 번 확인용
  const viewCount = app.views ?? 0; // 조회수는 서버에서 작품과 함께 옵니다
  const cat = categories.find((c) => c.id === app.category);

  // 담긴 숫자 — 지금은 이 브라우저 기준(0 또는 1), 서버 연결 후 전체 숫자로 바뀝니다.
  const savedCount = saved ? 1 : 0;

  const isNew = app.createdAt !== undefined && Date.now() - app.createdAt < 7 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    setSaved(isSaved(app.id));
  }, [app.id]);

  const goPlay = () => router.push(`/play/${app.id}`);

  // GO! — 빨리 하고 싶은 사람용: 전체 화면 게임방으로 바로 갑니다.
  // (새 창이 아니라 같은 창이라 뒤로 가기로 돌아올 수 있어요. 조회수도 +1.
  //  실행 주소가 없으면 소개 화면으로)
  const goRun = () => {
    if (app.url) {
      addServerView(app.id);
      router.push(`/run/${app.id}`);
    } else {
      goPlay();
    }
  };

  const onHeart = () => {
    const next = toggleSaved(app.id);
    setSaved(next);
    if (onSavedChange) onSavedChange();
  };

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

      {/* 내 둥지에서만 보이는 빼기(✕) — 한 번 누르면 확인, 한 번 더 누르면 빼기 */}
      {onRemove &&
        (removing ? (
          <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6, zIndex: 2 }}>
            <button
              onClick={() => setRemoving(false)}
              style={{
                height: 36,
                padding: "0 12px",
                borderRadius: 18,
                border: `1px solid ${colors.line}`,
                background: colors.surface,
                color: colors.textSub,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {labels.cancel}
            </button>
            <button
              onClick={() => onRemove(app.id)}
              style={{
                height: 36,
                padding: "0 12px",
                borderRadius: 18,
                border: "none",
                background: "#E24B4A",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              빼기
            </button>
          </div>
        ) : (
          <button
            onClick={() => setRemoving(true)}
            aria-label="목록에서 빼기"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 36,
              height: 36,
              borderRadius: 18,
              border: `1px solid ${colors.line}`,
              background: colors.surface,
              color: colors.textSub,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              zIndex: 2,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        ))}

      {/* 그림 — 누르면 실행 화면으로 */}
      <button
        onClick={goPlay}
        aria-label={`${app.title} 실행 화면 열기`}
        style={{
          display: "block",
          width: "100%",
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
            aspectRatio: "1 / 0.8",
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
            <span style={{ fontSize: 60 }}>{app.emoji}</span>
          )}
        </div>

        {/* 글자 영역 — 가운데 정렬로 깔끔하게 */}
        <div style={{ padding: "12px 14px 0", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: font.sub, color: colors.mintText, fontWeight: 600 }}>
            {cat ? `${cat.icon} ${cat.name}` : ""}
            {app.minutes ? ` · ${app.minutes}분` : ""}
            <span style={{ color: colors.textSub, fontWeight: 400 }}>{` · 조회 ${viewCount}`}</span>
          </p>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: font.cardTitle,
              fontWeight: 700,
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

      {/* GO! + 하트(담긴 숫자) — GO!는 전체 화면 게임방으로, 나머지는 소개 화면으로 */}
      <div style={{ display: "flex", gap: 8, padding: "12px 14px 14px" }}>
        <button
          onClick={goRun}
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
            letterSpacing: "0.02em",
          }}
        >
          {runLabel(app.category)}
        </button>
        <button
          onClick={onHeart}
          aria-label={saved ? labels.unsave : labels.save}
          style={{
            flex: 1,
            height: 48,
            padding: "0 10px",
            borderRadius: 24,
            border: saved ? "none" : `1px solid ${colors.line}`,
            background: saved ? colors.orangeSoft : colors.surface,
            color: saved ? colors.orangeText : colors.textSub,
            fontSize: font.body,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <span aria-hidden="true">{saved ? "💛" : "🤍"}</span>
          {saved ? savedCount : labels.save}
        </button>
      </div>
    </div>
  );
}
