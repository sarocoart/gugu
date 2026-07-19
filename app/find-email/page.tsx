"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import Field from "@/components/FormField";
import { colors, font } from "@/lib/theme";
import { supabase } from "@/lib/supabase";

// 이메일(아이디) 찾기 — 가입했을 것 같은 이메일로 확인 메일을 보내봅니다.
// 메일이 도착하면 그 주소가 가입한 이메일! 그 메일로 비밀번호 재설정까지 바로 이어져요.
// (아무나 남의 가입 여부를 캐볼 수 없도록, 답은 본인 메일함으로만 갑니다)
export default function FindEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState(""); // 확인 메일을 보낸 주소

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

  const check = async () => {
    if (!supabase) return;
    setError("");
    const em = email.trim();
    if (em === "" || !em.includes("@")) return setError("확인해볼 이메일을 적어 주세요.");
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(em, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) {
        const m = (err.message || "").toLowerCase();
        if (m.includes("second")) {
          setError("너무 자주 확인했어요. 60초 뒤에 다시 눌러 주세요.");
        } else if (m.includes("rate") || m.includes("limit")) {
          setError("오늘 보낼 수 있는 메일 수를 넘었어요. 1시간 뒤에 다시 해주세요.");
        } else {
          setError(`확인 메일을 보내지 못했어요. (${err.message})`);
        }
      } else {
        setSentTo(em);
      }
    } catch {
      setError("잠시 문제가 생겼어요. 다시 시도해 주세요.");
    }
    setBusy(false);
  };

  // 보낸 뒤 — 결과 해석을 안내합니다.
  if (sentTo) {
    return (
      <div style={{ padding: "40px 16px", maxWidth: 440, margin: "0 auto", textAlign: "center" }}>
        <Pigeon size={90} mood="hello" />
        <h1 style={{ margin: "14px 0 10px", fontSize: font.title, fontWeight: 700, color: colors.text }}>
          <b>{sentTo}</b>
          <br />
          메일함을 확인해 보세요
        </h1>
        <p style={{ margin: "0 0 6px", fontSize: font.body, color: colors.text, lineHeight: 1.7 }}>
          📬 <b>메일이 왔다면</b> — 그 주소가 가입한 이메일이에요!
          <br />
          메일 속 링크로 비밀번호도 새로 정할 수 있어요.
        </p>
        <p style={{ margin: "0 0 20px", fontSize: font.sub, color: colors.textSub, lineHeight: 1.7 }}>
          📭 몇 분 기다려도 안 오면(스팸함도 확인!) 그 주소는 가입된 게 아니에요.
          <br />
          아래 버튼으로 다른 이메일을 확인해 보세요.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <RunButton
            label="다른 이메일 확인하기"
            onClick={() => {
              setSentTo("");
              setEmail("");
            }}
          />
        </div>
        <button
          onClick={() => router.push("/login")}
          style={{
            display: "block",
            margin: "16px auto 0",
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
    );
  }

  return (
    <div style={{ padding: "40px 16px", maxWidth: 440, margin: "0 auto" }}>
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
            이메일 찾기
          </h1>
          <p style={{ margin: 0, fontSize: font.sub, color: colors.textSub, lineHeight: 1.6 }}>
            가입했을 것 같은 이메일을 적으면
            <br />
            확인 메일을 보내드려요.
            <br />
            메일이 도착한 주소 = 가입한 이메일!
          </p>
        </div>

        <Field label="이메일" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />

        {error && (
          <p style={{ color: "#C0392B", fontSize: font.sub, margin: "0 0 12px", fontWeight: 600 }}>{error}</p>
        )}

        <RunButton wide label={busy ? "잠깐만요..." : "이 이메일로 확인 메일 보내기"} onClick={check} />

        {/* 꿀팁 — 메일함 검색으로 스스로 찾는 방법 */}
        <div
          style={{
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 14,
            background: colors.mint,
          }}
        >
          <p style={{ margin: 0, fontSize: font.sub, color: colors.mintText, fontWeight: 600, lineHeight: 1.7 }}>
            💡 꿀팁: 쓰는 메일함(Gmail 등)에서 &quot;빌트마켓&quot; 또는 &quot;Supabase&quot;를
            검색해 보세요. 가입할 때 받은 메일이 남아 있다면, 그 메일함 주소가 바로 계정이에요!
          </p>
        </div>

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
