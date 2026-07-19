"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import { colors, font } from "@/lib/theme";
import { supabase } from "@/lib/supabase";

// 로그인/회원가입 화면 — 빌트마켓과 같은 서버를 써서 계정이 서로 통합니다.
// 빌트마켓에서 가입한 계정으로 여기서 바로 로그인할 수 있어요.

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: font.body, fontWeight: 600, color: colors.text, marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 48,
          borderRadius: 14,
          border: `1px solid ${colors.line}`,
          background: colors.surface,
          padding: "0 16px",
          fontSize: font.body,
          color: colors.text,
          outline: "none",
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  // 서버 연결 전 — 안내만 보여줍니다.
  if (!supabase) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Pigeon size={90} mood="empty" />
        <p style={{ fontSize: font.body, color: colors.text, margin: "14px 0 6px", fontWeight: 600 }}>
          로그인은 준비 중이구구!
        </p>
        <p style={{ fontSize: font.sub, color: colors.textSub, margin: "0 0 18px" }}>
          서버 연결(환경 변수 등록)이 끝나면 이 화면에서 빌트마켓 계정으로 로그인할 수 있어요.
        </p>
        <RunButton label="홈으로" onClick={() => router.push("/")} />
      </div>
    );
  }

  const submit = async () => {
    if (!supabase) return; // 서버 연결 전엔 동작하지 않아요 (위에서 이미 안내 화면 표시)
    setError("");
    setNotice("");
    const em = email.trim();
    const pw = password;
    if (em === "" || !em.includes("@")) return setError("이메일을 확인해 주세요.");
    if (pw.length < 6) return setError("비밀번호는 6자 이상이에요.");
    if (mode === "signup" && nickname.trim() === "") return setError("닉네임을 적어 주세요.");

    setBusy(true);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email: em, password: pw });
        if (err) {
          setError("이메일 또는 비밀번호가 맞지 않아요.");
        } else {
          router.push("/nest");
        }
      } else {
        // 빌트마켓과 같은 방식 — 닉네임을 함께 보내면 서버가 프로필을 만들어 줍니다.
        const { error: err } = await supabase.auth.signUp({
          email: em,
          password: pw,
          options: { data: { nickname: nickname.trim() } },
        });
        if (err) {
          setError("가입에 실패했어요. 이미 가입된 이메일일 수 있어요.");
        } else {
          setNotice("가입 요청 완료! 메일함에 확인 메일이 왔다면 눌러서 인증해 주세요.");
        }
      }
    } catch {
      setError("잠시 문제가 생겼어요. 다시 시도해 주세요.");
    }
    setBusy(false);
  };

  return (
    <div style={{ padding: "24px 16px", maxWidth: 440, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Pigeon size={72} mood="hello" />
        <h1 style={{ margin: "10px 0 4px", fontSize: font.title, fontWeight: 700, color: colors.text }}>
          {mode === "login" ? "로그인" : "회원가입"}
        </h1>
        <p style={{ margin: 0, fontSize: font.sub, color: colors.textSub }}>
          빌트마켓 계정 그대로 쓸 수 있어요
        </p>
      </div>

      {/* 로그인 / 회원가입 전환 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button
          onClick={() => {
            setMode("login");
            setError("");
            setNotice("");
          }}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 16,
            border: "none",
            background: mode === "login" ? colors.orangeSoft : colors.surface,
            color: mode === "login" ? colors.orangeText : colors.textSub,
            fontSize: font.body,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          로그인
        </button>
        <button
          onClick={() => {
            setMode("signup");
            setError("");
            setNotice("");
          }}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 16,
            border: "none",
            background: mode === "signup" ? colors.orangeSoft : colors.surface,
            color: mode === "signup" ? colors.orangeText : colors.textSub,
            fontSize: font.body,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          처음이에요
        </button>
      </div>

      {mode === "signup" && (
        <Field label="닉네임" value={nickname} onChange={setNickname} placeholder="예: 구구" />
      )}
      <Field label="이메일" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
      <Field label="비밀번호" value={password} onChange={setPassword} placeholder="6자 이상" type="password" />

      {error && (
        <p style={{ color: "#C0392B", fontSize: font.sub, margin: "0 0 12px", fontWeight: 600 }}>{error}</p>
      )}
      {notice && (
        <p style={{ color: colors.mintText, fontSize: font.sub, margin: "0 0 12px", fontWeight: 600 }}>{notice}</p>
      )}

      <RunButton
        wide
        label={busy ? "잠깐만요..." : mode === "login" ? "로그인" : "가입하기"}
        onClick={submit}
      />

      <p style={{ fontSize: font.sub, color: colors.textSub, textAlign: "center", marginTop: 14 }}>
        비밀번호를 잊었다면 빌트마켓의 "비밀번호 찾기"를 이용해 주세요. 같은 계정이에요.
      </p>
    </div>
  );
}
