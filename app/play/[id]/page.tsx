"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import type { GuguApp } from "@/lib/data";
import { findApp } from "@/lib/catalog";
import { labels } from "@/lib/labels";
import { features } from "@/lib/features";
import { colors, font } from "@/lib/theme";
import { isSaved, toggleSaved, markPlayed } from "@/lib/storage";

export default function PlayPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [app, setApp] = useState<GuguApp | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = findApp(params.id);
    setApp(found);
    setReady(true);
    if (found) {
      setSaved(isSaved(found.id));
      if (found.url) markPlayed(found.id);
    }
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

  const openNewTab = () => {
    if (app.url) window.open(app.url, "_blank", "noopener");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
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
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: font.cardTitle, fontWeight: 600, color: colors.text }}>
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
            }}
          >
            {saved ? "💛 담음" : `🤍 ${labels.save}`}
          </button>
        )}
      </div>

      {app.url ? (
        <div style={{ padding: 16 }}>
          <iframe
            src={app.url}
            title={app.title}
            style={{
              width: "100%",
              height: "min(62vh, 560px)",
              border: `1px solid ${colors.line}`,
              borderRadius: 18,
              background: colors.surface,
            }}
          />
          <p style={{ textAlign: "center", fontSize: font.sub, color: colors.textSub, margin: "12px 0 8px" }}>
            화면이 안 보이면 아래 버튼을 눌러 주세요.
          </p>
          <RunButton wide label={labels.runNewTab} onClick={openNewTab} />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <Pigeon size={90} mood="empty" />
          <p style={{ fontSize: font.body, color: colors.text }}>{labels.demoNotReady}</p>
          <p style={{ fontSize: font.sub, color: colors.textSub }}>
            lib/data.ts에서 이 작품의 url을 채우면 여기서 바로 실행됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
