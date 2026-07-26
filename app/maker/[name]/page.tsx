"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import AppCard from "@/components/AppCard";
import type { GuguApp } from "@/lib/data";
import { fetchAllApps } from "@/lib/catalog";
import { getSaved } from "@/lib/storage";
import { colors, font } from "@/lib/theme";
import { contactKind, qrImageUrl } from "@/lib/contact";

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
  const [showContact, setShowContact] = useState(false); // 연락 방법 상자 열림/닫힘
  const [copiedContact, setCopiedContact] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const all = await fetchAllApps();
      if (!alive) return;
      const list = all.filter((a) => a.maker === makerName);
      setWorks(list);
      const savedIds = getSaved();
      setTotalViews(list.reduce((sum, a) => sum + (a.views ?? 0), 0));
      setTotalSaves(list.reduce((sum, a) => sum + (savedIds.includes(a.id) ? 1 : 0), 0));
      // 이 메이커의 작품 중 연락 주소가 있는 첫 작품에서 가져옵니다.
      const withContact = list.find((a) => a.contact && a.contact.trim() !== "");
      setContact(withContact?.contact ?? "");
    })();
    return () => {
      alive = false;
    };
  }, [makerName]);

  // 채팅/제작 의뢰 — 버튼을 누르면 연락 방법 상자가 열립니다.
  // (링크는 바로 연결 버튼+QR, 이메일은 메일 버튼, 카톡 ID는 복사+안내)
  const kind = contactKind(contact);
  const openChat = () => {
    if (kind === "none") {
      setNoContactMsg(true);
      window.setTimeout(() => setNoContactMsg(false), 2500);
      return;
    }
    setShowContact((v) => !v);
  };

  // 연락처 글자를 복사합니다 (안 되는 환경이면 조용히 넘어가요).
  const copyContact = async () => {
    try {
      await navigator.clipboard.writeText(contact);
      setCopiedContact(true);
      window.setTimeout(() => setCopiedContact(false), 2000);
    } catch {
      // 무시
    }
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

        {/* 연락 방법 상자 — 방법에 따라 바로 연결·QR·복사를 보여줍니다 */}
        {showContact && kind !== "none" && (
          <div
            style={{
              maxWidth: 380,
              margin: "14px auto 0",
              padding: "18px 16px",
              borderRadius: 20,
              background: colors.surface,
              border: `1px solid ${colors.line}`,
              textAlign: "center",
            }}
          >
            {kind === "link" && (
              <div>
                <button
                  onClick={() => window.open(contact, "_blank", "noopener")}
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 25,
                    border: "none",
                    background: colors.orange,
                    color: "#FFFFFF",
                    fontSize: font.body,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  💬 채팅으로 바로 연결
                </button>
                {/* QR — PC로 보는 사람이 휴대폰 카메라로 찍으면 바로 채팅이 열려요 */}
                <img
                  src={qrImageUrl(contact)}
                  alt="채팅 연결 QR코드"
                  width={180}
                  height={180}
                  loading="lazy"
                  style={{
                    display: "block",
                    margin: "14px auto 0",
                    borderRadius: 12,
                    border: `1px solid ${colors.line}`,
                    background: "#FFFFFF",
                  }}
                />
                <p style={{ margin: "8px 0 0", fontSize: font.sub, color: colors.textSub }}>
                  PC로 보고 있다면 휴대폰 카메라로 QR을 찍어 보세요 — 바로 연결돼요.
                </p>
                <button
                  onClick={copyContact}
                  style={{
                    marginTop: 10,
                    height: 40,
                    padding: "0 16px",
                    borderRadius: 20,
                    border: `1px solid ${colors.line}`,
                    background: colors.surface,
                    color: colors.textSub,
                    fontSize: font.sub,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {copiedContact ? "복사됨 ✓" : "링크 복사"}
                </button>
              </div>
            )}

            {kind === "email" && (
              <div>
                <button
                  onClick={() => window.open(`mailto:${contact}`, "_blank", "noopener")}
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 25,
                    border: "none",
                    background: colors.orange,
                    color: "#FFFFFF",
                    fontSize: font.body,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✉️ 메일 보내기
                </button>
                <p style={{ margin: "12px 0 0", fontSize: font.body, fontWeight: 600, color: colors.text, wordBreak: "break-all" }}>
                  {contact}
                </p>
                <button
                  onClick={copyContact}
                  style={{
                    marginTop: 8,
                    height: 40,
                    padding: "0 16px",
                    borderRadius: 20,
                    border: `1px solid ${colors.line}`,
                    background: colors.surface,
                    color: colors.textSub,
                    fontSize: font.sub,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {copiedContact ? "복사됨 ✓" : "주소 복사"}
                </button>
              </div>
            )}

            {kind === "kakaoId" && (
              <div>
                <p style={{ margin: 0, fontSize: font.sub, color: colors.textSub }}>카카오톡 ID</p>
                <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 700, color: colors.text, wordBreak: "break-all" }}>
                  {contact}
                </p>
                <button
                  onClick={copyContact}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    height: 50,
                    borderRadius: 25,
                    border: "none",
                    background: colors.orange,
                    color: "#FFFFFF",
                    fontSize: font.body,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {copiedContact ? "복사됨 ✓" : "🆔 ID 복사하기"}
                </button>
                <p style={{ margin: "10px 0 0", fontSize: font.sub, color: colors.textSub }}>
                  카카오톡 → 친구 → 친구 추가 → ID 검색에 붙여넣으면 돼요.
                </p>
              </div>
            )}
          </div>
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
