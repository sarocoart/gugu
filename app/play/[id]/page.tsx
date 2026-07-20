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
import { isSaved, toggleSaved } from "@/lib/storage";

// 실행 화면 — 게임이 "미리보기"로 바로 보이고, 실제 플레이는 전체 화면 게임방에서.
// 미리보기는 눈으로만 보는 창(클릭하면 새 창이 열림)이라
// 게임 안쪽 스크롤이 생기지 않아 페이지 스크롤이 하나뿐입니다.
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

  // 전체 화면 게임방으로 — 같은 창이라 뒤로 가기로 언제든 돌아옵니다.
  // ("해본 것" 기록은 게임방에서 한 번만 남습니다)
  const goRun = () => router.push(`/run/${app.id}`);

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
      {/* 상단 바 — 뒤로 / 제목 / 메이커 홈 / 담기 / 공유 (좁은 화면에선 자연스럽게 줄바꿈) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          padding: "12px 16px",
          background: colors.mocha,
        }}
      >
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
        <p
          style={{
            flex: 1,
            minWidth: 120,
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
        {/* 메이커 홈 버튼 — 민트색으로 확실히 "버튼"처럼. 작품 전체·제작 의뢰가 여기 있어요 */}
        <button
          onClick={goMaker}
          style={{
            height: 44,
            padding: "0 18px",
            borderRadius: 22,
            border: "none",
            background: colors.mint,
            color: colors.mintText,
            fontSize: font.body,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          🕊️ {app.maker}님 홈
        </button>
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

      {app.url ? (
        <section style={{ padding: "20px 16px 8px", textAlign: "center" }}>
          {/* 실행 — 항상 새 창에서 크게 */}
          <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <RunButton wide label={`🚀 ${labels.runNewTab}`} onClick={goRun} />
          </div>

          {/* 한 줄 소개 — 가운데 정렬, 잘 보이게 */}
          {app.desc && (
            <p
              style={{
                margin: "16px auto 0",
                maxWidth: 560,
                fontSize: 18,
                fontWeight: 600,
                color: colors.text,
                lineHeight: 1.7,
                whiteSpace: "pre-line", // 소개 글의 줄바꿈을 그대로 보여줍니다
              }}
            >
              {app.desc}
            </p>
          )}

          {/* 게임 미리보기 — 눈으로만 보는 창. 누르면 새 창에서 열려요.
              (미리보기 안에서는 스크롤·클릭이 안 되게 해서 페이지 스크롤이 하나만 남습니다) */}
          <div
            style={{
              position: "relative",
              maxWidth: 720,
              margin: "18px auto 0",
              borderRadius: 20,
              overflow: "hidden",
              border: `1px solid ${colors.line}`,
              background: colors.surface,
            }}
          >
            <iframe
              src={app.url}
              title={`${app.title} 미리보기`}
              tabIndex={-1}
              style={{
                display: "block",
                width: "100%",
                height: 480,
                border: "none",
                pointerEvents: "none", // 미리보기 전용 — 안쪽 스크롤 방지
                background: colors.surface,
              }}
            />
            {/* 미리보기 전체를 덮는 투명 버튼 — 어디를 눌러도 새 창으로 */}
            <button
              onClick={goRun}
              aria-label={`${app.title} 크게 하기`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
              }}
            />
            {/* 안내 배지 */}
            <span
              style={{
                position: "absolute",
                left: "50%",
                bottom: 12,
                transform: "translateX(-50%)",
                background: "rgba(69,59,50,0.82)",
                color: "#FFFFFF",
                fontSize: font.sub,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 18,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              👀 미리보기예요 — 누르면 크게 열려요
            </span>
          </div>

          {/* 통계 */}
          <p style={{ margin: "14px 0 0", fontSize: font.sub, color: colors.textSub, fontWeight: 600 }}>
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
