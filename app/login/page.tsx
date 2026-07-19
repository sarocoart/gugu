"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import { colors, font } from "@/lib/theme";
import { supabase } from "@/lib/supabase";
import Field from "@/components/FormField";

// 로그인 화면 — 버튼 하나("시작하기")로 로그인과 가입을 모두 처리합니다.
// 1) 계정이 있으면 바로 로그인
// 2) 처음이면 닉네임 한 칸이 나타나고, 한 번 더 누르면 가입 완료
// 빌트마켓과 같은 서버라 계정이 서로 통합니다.

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [askNickname, setAskNickname] = useState(false); // 처음 온 사람에게만 닉네임 칸을 보여줍니다
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
    if (!supabase) return;
    setError("");
    setNotice("");
    const em = email.trim();
    const pw = password;
    if (em === "" || !em.includes("@")) return setError("이메일을 확인해 주세요.");
    if (pw.length < 6) return setError("비밀번호는 6자 이상이에요.");

    setBusy(true);
    try {
      // 1단계 — 일단 로그인을 시도합니다.
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email: em, password: pw });
      if (!loginErr) {
        router.push("/nest");
        setBusy(false);
        return;
      }

      // 2단계 — 로그인이 안 되면: 처음 온 사람일 수 있어요.
      if (!askNickname) {
        // 닉네임 칸을 열고 한 번 더 누르게 합니다 (이메일 오타로 엉뚱한 가입이 되는 걸 방지).
        setAskNickname(true);
        setNotice("처음 오셨나요? 닉네임을 적고 한 번 더 눌러 주세요. 이미 계정이 있다면 비밀번호를 확인해 주세요.");
        setBusy(false);
        return;
      }

      // 3단계 — 닉네임까지 적었으면 가입을 진행합니다.
      if (nickname.trim() === "") {
        setError("닉네임을 적어 주세요.");
        setBusy(false);
        return;
      }
      const { data, error: signupErr } = await supabase.auth.signUp({
        email: em,
        password: pw,
        options: { data: { nickname: nickname.trim() } },
      });
      if (signupErr) {
        setError("이미 가입된 이메일 같아요. 비밀번호를 다시 확인해 주세요.");
      } else if (data.session) {
        router.push("/nest"); // 메일 인증이 꺼져 있으면 바로 로그인됩니다.
      } else if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        // 이미 가입된 이메일이면 서버가 (보안상 티 안 내고) 아무것도 안 보내는 대신
        // identities가 빈 배열로 옵니다 — 이걸로 구분해서 정확히 안내해요.
        setAskNickname(false);
        setError("이 이메일은 이미 가입되어 있어요! 비밀번호가 맞지 않는 것 같아요. 아래 '비밀번호 찾기'로 새 비밀번호를 만들어 주세요.");
      } else {
        setNotice("가입 완료! 메일함(스팸함 포함)에서 확인 메일을 눌러 인증한 뒤, 다시 시작하기를 눌러 주세요.");
      }
    } catch {
      setError("잠시 문제가 생겼어요. 다시 시도해 주세요.");
    }
    setBusy(false);
  };

  return (
    <div style={{ padding: "24px 16px", maxWidth: 440, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <Pigeon size={72} mood="hello" />
        <h1 style={{ margin: "10px 0 4px", fontSize: font.title, fontWeight: 700, color: colors.text }}>
          시작하기
        </h1>
        <p style={{ margin: 0, fontSize: font.sub, color: colors.textSub }}>
          처음이어도, 빌트마켓 계정이 있어도 여기 하나면 돼요
        </p>
      </div>

      <Field label="이메일" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
      <Field label="비밀번호" value={password} onChange={setPassword} placeholder="6자 이상" type="password" />
      {askNickname && (
        <Field label="닉네임 (처음 오신 분만)" value={nickname} onChange={setNickname} placeholder="예: 구구" />
      )}

      {error && (
        <p style={{ color: "#C0392B", fontSize: font.sub, margin: "0 0 12px", fontWeight: 600 }}>{error}</p>
      )}
      {notice && (
        <p style={{ color: colors.mintText, fontSize: font.sub, margin: "0 0 12px", fontWeight: 600 }}>{notice}</p>
      )}

      <RunButton
        wide
        label={busy ? "잠깐만요..." : askNickname ? "가입하고 시작하기" : "시작하기"}
        onClick={submit}
      />

      <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 14 }}>
        <button
          onClick={() => router.push("/forgot-password")}
          style={{
            background: "none",
            border: "none",
            color: colors.textSub,
            fontSize: font.sub,
            fontWeight: 600,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          비밀번호 찾기
        </button>
        <button
          onClick={() => router.push("/find-email")}
          style={{
            background: "none",
            border: "none",
            color: colors.textSub,
            fontSize: font.sub,
            fontWeight: 600,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          이메일 찾기
        </button>
      </div>
    </div>
  );
}
