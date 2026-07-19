"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import { colors, font } from "@/lib/theme";
import { supabase } from "@/lib/supabase";
import Field from "@/components/FormField";

// 비밀번호 찾기 — 가입한 이메일로 재설정 링크를 보냅니다.
// 메일의 링크를 누르면 /reset-password(새 비밀번호 정하기)로 돌아와요.
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!supabase) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Pigeon size={90} mood="empty" />
        <p style={{ fontSize: font.body, color: colors.text, margin: "14px 0 18px", fontWeight: 600 }}>
          서버 연결 준비 중이구구!
        </p>
        <RunButton label="홈으로" onClick={() => router.push("/")} />
      </div>
    );
  }

  const send = async () => {
    if (!supabase) return;
    setError("");
    const em = email.trim();
    if (em === "" || !em.includes("@")) return setError("가입할 때 쓴 이메일을 적어 주세요.");
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(em, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) {
        const m = (err.message || "").toLowerCase();
        if (m.includes("second")) {
          setError("너무 자주 요청했어요. 60초 뒤에 다시 눌러 주세요.");
        } else if (m.includes("rate") || m.includes("limit")) {
          setError("오늘 보낼 수 있는 메일 수를 넘었어요. 1시간 뒤에 다시 해주세요. (먼저 온 메일이 스팸함에 있는지도 확인!)");
        } else {
          setError(`메일을 보내지 못했어요. (${err.message})`);
        }
      } else {
        setSent(true);
      }
    } catch {
      setError("잠시 문제가 생겼어요. 다시 시도해 주세요.");
    }
    setBusy(false);
  };

  // 보낸 뒤 — 다음에 할 일을 안내합니다.
  if (sent) {
    return (
      <div style={{ padding: "40px 16px", maxWidth: 440, margin: "0 auto", textAlign: "center" }}>
        <Pigeon size={90} mood="party" />
        <h1 style={{ margin: "14px 0 8px", fontSize: font.title, fontWeight: 700, color: colors.text }}>
          메일을 보냈어요!
        </h1>
        <p style={{ margin: "0 0 6px", fontSize: font.body, color: colors.text, lineHeight: 1.6 }}>
          <b>{email.trim()}</b> 메일함을 열고
          <br />
          재설정 링크를 눌러 주세요.
        </p>
        <p style={{ margin: "0 0 20px", fontSize: font.sub, color: colors.textSub }}>
          안 보이면 스팸함도 확인해 주세요.
        </p>
        <RunButton label="로그인으로 돌아가기" onClick={() => router.push("/login")} />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 16px", maxWidth: 440, margin: "0 auto" }}>
      {/* 카드 상자 */}
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.line}`,
          borderRadius: 20,
          padding: "28px 20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Pigeon size={64} mood="hello" />
          <h1 style={{ margin: "10px 0 6px", fontSize: font.title, fontWeight: 700, color: colors.text }}>
            비밀번호 찾기
          </h1>
          <p style={{ margin: 0, fontSize: font.sub, color: colors.textSub, lineHeight: 1.6 }}>
            가입한 이메일을 적으면
            <br />
            재설정 링크를 보내드려요.
          </p>
        </div>

        <Field label="이메일" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />

        {error && (
          <p style={{ color: "#C0392B", fontSize: font.sub, margin: "0 0 12px", fontWeight: 600 }}>{error}</p>
        )}

        <RunButton wide label={busy ? "잠깐만요..." : "재설정 메일 보내기"} onClick={send} />

        <button
          onClick={() => router.push("/login")}
          style={{
            display: "block",
            margin: "14px auto 0",
            background: "none",
            border: "none",
            color: colors.textSub,
            fontSize: font.sub,
            fontWeight: 600,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}
