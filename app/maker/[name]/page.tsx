"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import AppCard from "@/components/AppCard";
import type { GuguApp } from "@/lib/data";
import { getAllApps } from "@/lib/catalog";
import { getViews, getSaved } from "@/lib/storage";
import { colors, font } from "@/lib/theme";

// 메이커 페이지 — 만든 사람의 프로필과 작품 전부를 보여줍니다.
// 채팅 버튼: 메이커가 연락 주소(오픈채팅/이메일)를 남겼으면 그리로 연결됩니다.
// 서버 연결 후에는 구구마켓 안의 진짜 채팅으로 업그레이드할 자리예요.
export default function MakerPage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const makerName = decodeURIComponent(params.name);
  const [works, setWorks] = useState<GuguApp[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalSaves, setTotalSaves] = useState(0);
  const [contact, setContact] = useState("");
  const [copied, setCopied] = useState(false);
  const [noContactMsg, setNoContactMsg] = useState(false);

  useEffect(() => {
    const list = getAllApps().filter((a) => a.maker === makerName);
    setWorks(list);
    const views = getViews();
    const savedIds = getSaved();
    setTotalViews(list.reduce((sum, a) => sum + (views[a.id] ?? 0), 0));
    setTotalSaves(list.reduce((sum, a) => sum + (savedIds.includes(a.id) ? 1 : 0), 0));
    // 이 메이커의 작품 중 연락 주소가 있는 첫 작품에서 가져옵니다.
    const withContact = list.find((a) => a.contact && a.contact.trim() !== "");
    setContact(withContact?.contact ?? "");
  }, [makerName]);

  // 채팅/제작 의뢰 — 이메일이면 메일 앱, 링크면 새 창으로.
  const openChat = () => {
    if (!contact) {
      setNoContactMsg(true);
      window.setTimeout(() => setNoContactMsg(false), 2500);
      return;
    }
    const target = contact.includes("@") && !contact.startsWith("http") ? `mailto:${contact}` : contact;
    window.open(target, "_blank", "noopener");
  };

  // 메이커 페이지 공유 — 휴대폰은 공유창, PC는 링크 복사.
  const share = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `구구마켓 — ${makerName}님의 작품`, url: shareUrl });
        return;
      }
    } catch {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 무시
    }
  };

  return (
    <div>
      <header
        style={{
          background: colors.mocha,
          padding: "28px 20px 24px",
          textAlign: "center",
          borderRadius: "0 0 28px 28px",
        }}
      >
        <Pigeon size={80} mood="hello" />
        <h1 style={{ margin: "10px 0 4px", fontSize: font.title, fontWeight: 700, color: colors.text }}>
          {makerName}
        </h1>
        <p style={{ margin: 0, fontSize: font.sub, color: colors.textSub }}>
          작품 {works.length}개 · 조회 {totalViews} · 💛 담김 {totalSaves}
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          <button
            onClick={openChat}
            style={{
              height: 48,
              padding: "0 22px",
              borderRadius: 24,
              border: "none",
              background: colors.orange,
              color: "#FFFFFF",
              fontSize: font.body,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            💬 제작 의뢰·채팅
          </button>
          <button
            onClick={share}
            style={{
              height: 48,
              padding: "0 18px",
              borderRadius: 24,
              border: `1px solid ${colors.line}`,
              background: colors.surface,
              color: colors.text,
              fontSize: font.body,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copied ? "복사됨 ✓" : "📤 공유"}
          </button>
        </div>
        {noContactMsg && (
          <p style={{ margin: "10px 0 0", fontSize: font.sub, color: colors.orangeText, fontWeight: 600 }}>
            아직 연락 주소를 안 남겼구구. 곧 채팅이 열릴 거예요!
          </p>
        )}
      </header>

      <section style={{ padding: "20px 16px" }}>
        <h2 style={{ margin: "0 4px 12px", fontSize: font.cardTitle, fontWeight: 700, color: colors.text }}>
          {makerName}님의 작품
        </h2>
        {works.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <Pigeon size={72} mood="empty" />
            <p style={{ fontSize: font.body, color: colors.textSub }}>아직 보여줄 작품이 없구구.</p>
          </div>
        ) : (
          <div className="gugu-grid">
            {works.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
