"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import { colors, font } from "@/lib/theme";
import { supabase } from "@/lib/supabase";
import Field from "@/components/FormField";

// 새 비밀번호 정하기 — 재설정 메일의 링크를 누르면 이 화면으로 돌아옵니다.
// (메일 링크로 들어오면 잠시 로그인된 상태가 되어, 새 비밀번호를 저장할 수 있어요)
export default function ResetPasswordPage() {
  const router = useRouter();
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [linkDead, setLinkDead] = useState(false); // 만료되거나 이미 쓴 링크로 들어온 경우

  // 메일 링크가 만료되면 주소 뒤에 #error=...가 붙어서 옵니다. 그걸 감지해요.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("error")) {
      setLinkDead(true);
    }
  }, []);

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

  const submit = async () => {
    if (!supabase) return;
    setError("");
    if (pw1.length < 6) return setError("비밀번호는 6자 이상이에요.");
    if (pw1 !== pw2) return setError("두 비밀번호가 서로 달라요. 똑같이 적어 주세요.");
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password: pw1 });
      if (err) {
        setError("저장하지 못했어요. 메일의 링크로 다시 들어와 주세요.");
      } else {
        setDone(true);
      }
    } catch {
      setError("잠시 문제가 생겼어요. 다시 시도해 주세요.");
    }
    setBusy(false);
  };

  // 만료된 링크 안내 — 새 메일을 받도록 안내합니다.
  if (linkDead) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Pigeon size={90} mood="empty" />
        <p style={{ fontSize: font.body, color: colors.text, margin: "14px 0 6px", fontWeight: 600 }}>
          이 링크는 시간이 지나서 못 쓰게 됐구구.
        </p>
        <p style={{ fontSize: font.sub, color: colors.textSub, margin: "0 0 18px" }}>
          링크는 1시간 안에, 한 번만 쓸 수 있어요.
          <br />
          새 메일을 받아서 다시 해봐요!
        </p>
        <RunButton label="재설정 메일 다시 받기" onClick={() => router.push("/forgot-password")} />
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Pigeon size={90} mood="party" />
        <p style={{ fontSize: font.body, color: colors.text, margin: "14px 0 18px", fontWeight: 600 }}>
          새 비밀번호로 바뀌었구구! 이제 이 비밀번호로 로그인하면 돼요.
        </p>
        <RunButton label="마이 페이지로 가기" onClick={() => router.push("/nest")} />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 16px", maxWidth: 440, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <Pigeon size={72} mood="hello" />
        <h1 style={{ margin: "10px 0 4px", fontSize: font.title, fontWeight: 700, color: colors.text }}>
          새 비밀번호 정하기
        </h1>
        <p style={{ margin: 0, fontSize: font.sub, color: colors.textSub }}>
          기억하기 쉬운 것으로, 두 번 똑같이 적어 주세요
        </p>
      </div>

      <Field label="새 비밀번호" value={pw1} onChange={setPw1} placeholder="6자 이상" type="password" />
      <Field label="한 번 더" value={pw2} onChange={setPw2} placeholder="같은 비밀번호" type="password" />

      {error && (
        <p style={{ color: "#C0392B", fontSize: font.sub, margin: "0 0 12px", fontWeight: 600 }}>{error}</p>
      )}

      <RunButton wide label={busy ? "잠깐만요..." : "저장하기"} onClick={submit} />
    </div>
  );
}
