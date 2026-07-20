"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import AppCard from "@/components/AppCard";
import type { GuguApp } from "@/lib/data";
import { fetchApp, fetchAllApps, addServerView } from "@/lib/catalog";
import { labels } from "@/lib/labels";
import { features } from "@/lib/features";
import { colors, font } from "@/lib/theme";
import { isSaved, toggleSaved, markPlayed } from "@/lib/storage";

// 실행 화면 — 게임은 항상 "새 창"에서 열립니다.
// 페이지 안에 게임을 끼워 넣던 방식(iframe)을 없애서 스크롤이 하나만 남고,
// 소개·메이커·추천이 한 번의 스크롤로 다 보입니다.
export default function PlayPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [app, setApp] = useState<GuguApp | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [others, setOthers] = useState<GuguApp[]>([]); // 아래에 보여줄 다른 작품들
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      const found = await fetchApp(params.id);
      if (!alive) return;
      setApp(found);
      setReady(true);
      // 지금 보는 작품을 뺀 나머지를 아래 추천으로 보여줍니다.
      const all = await fetchAllApps();
      if (alive) setOthers(all.filter((a) => a.id !== params.id).slice(0, 6));
      if (found) {
        addServerView(found.id); // 서버 조회수 1 올리기 (모두에게 집계)
        setViewCount((found.views ?? 0) + 1);
        setSaved(isSaved(found.id));
      }
    })();
    return () => {
      alive = false;
    };
  }, [params.id]);

  if (!ready) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Pigeon size={90} mood="hello" />
        <p style={{ fontSize: font.body, color: colors.textSub }}>잠깐만요 구구...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Pigeon size={90} mood="empty" />
        <p style={{ fontSize: font.body, color: colors.text }}>{labels.notFound}</p>
        <RunButton label="홈으로" onClick={() => router.push("/")} />
      </div>
    );
  }

  // 새 창에서 실행 — 이때 "해본 것"으로 기록됩니다.
  const openNewTab = () => {
    if (app.url) {
      markPlayed(app.id);
      window.open(app.url, "_blank", "noopener");
    }
  };

  const goMaker = () => router.push(`/maker/${encodeURIComponent(app.maker)}`);

  // 공유하기 — 휴대폰에선 기기 공유창(카톡 포함)이 열리고,
  // 공유창이 없는 환경(PC 등)에선 링크가 복사됩니다.
  const share = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `구구마켓 — ${app.title}`, url: shareUrl });
        return;
      }
    } catch {
      // 사용자가 공유창을 닫은 경우 등 — 아무것도 안 해도 됩니다.
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 복사가 안 되는 환경이면 조용히 넘어갑니다.
    }
  };

  return (
    <div>
      {/* 상단 바 — 뒤로 / 제목·메이커 / 담기 / 공유 */}
      <div style={{ background: colors.mocha, padding: "12px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => router.back()}
            aria-label="뒤로 가기"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              border: "none",
              background: colors.surface,
              fontSize: 20,
              cursor: "pointer",
              color: colors.text,
              flexShrink: 0,
            }}
          >
            ←
          </button>
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
            </p>
            <p style={{ margin: 0, fontSize: font.sub, color: colors.textSub }}>{app.maker}</p>
          </div>
          {features.saving && (
            <button
              onClick={() => setSaved(toggleSaved(app.id))}
              aria-label={saved ? labels.unsave : labels.save}
              style={{
                height: 44,
                padding: "0 16px",
                borderRadius: 22,
                border: "none",
                background: saved ? colors.orangeSoft : colors.surface,
                color: saved ? colors.orangeText : colors.text,
                fontSize: font.body,
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {saved ? "💛 1" : "🤍 0"}
            </button>
          )}
          <button
            onClick={share}
            aria-label="공유하기"
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 22,
              border: "none",
              background: colors.surface,
              color: colors.text,
              fontSize: font.body,
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {copied ? "복사됨 ✓" : "📤 공유"}
          </button>
        </div>

        {/* 메이커로 가는 큰 버튼 — 작품 더 보기·제작 의뢰가 모두 메이커 페이지에 있어요 */}
        <button
          onClick={goMaker}
          style={{
            marginTop: 10,
            width: "100%",
            height: 46,
            borderRadius: 23,
            border: `1px solid ${colors.line}`,
            background: colors.surface,
            color: colors.mintText,
            fontSize: font.body,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🕊️ {app.maker}님 작품 더 보기 · 제작 의뢰
        </button>
      </div>

      {app.url ? (
        <section style={{ padding: "28px 16px 8px", textAlign: "center" }}>
          {/* 작품 얼굴 — 그림이 있으면 그림, 없으면 이모지 */}
          {app.image ? (
            <img
              src={app.image}
              alt=""
              style={{
                width: 120,
                height: 120,
                borderRadius: 24,
                objectFit: "cover",
                border: `1px solid ${colors.line}`,
                background: colors.surface,
              }}
            />
          ) : (
            <div style={{ fontSize: 72, lineHeight: 1 }}>{app.emoji}</div>
          )}

          {/* 한 줄 소개 — 가운데 정렬, 잘 보이게 */}
          {app.desc && (
            <p
              style={{
                margin: "18px auto 0",
                maxWidth: 560,
                fontSize: 18,
                fontWeight: 600,
                color: colors.text,
                lineHeight: 1.7,
              }}
            >
              {app.desc}
            </p>
          )}

          {/* 실행 — 항상 새 창에서 크게 */}
          <div style={{ maxWidth: 420, margin: "22px auto 0" }}>
            <RunButton wide label={`🚀 ${labels.runNewTab}`} onClick={openNewTab} />
          </div>
          <p style={{ margin: "10px 0 0", fontSize: font.sub, color: colors.textSub }}>
            버튼을 누르면 게임이 새 창에서 크게 열려요.
          </p>

          {/* 통계 */}
          <p style={{ margin: "16px 0 0", fontSize: font.sub, color: colors.textSub, fontWeight: 600 }}>
            조회 {viewCount} · {saved ? "💛" : "🤍"} 담김 {saved ? 1 : 0}
          </p>
        </section>
      ) : (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <Pigeon size={90} mood="empty" />
          <p style={{ fontSize: font.body, color: colors.text }}>{labels.demoNotReady}</p>
          <p style={{ fontSize: font.sub, color: colors.textSub }}>
            lib/data.ts에서 이 작품의 url을 채우면 여기서 바로 실행됩니다.
          </p>
        </div>
      )}

      {/* 다른 작품들이 바로 보여요 — 공유로 온 사람도 여기서 계속 구경 */}
      {others.length > 0 && (
        <section style={{ padding: "24px 16px 24px" }}>
          <h2 style={{ margin: "0 4px 12px", fontSize: font.cardTitle, fontWeight: 700, color: colors.text }}>
            재밌는 작품이 더 많아요!
          </h2>
          <div className="gugu-grid">
            {others.map((a) => (
              <AppCard key={a.id} app={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
