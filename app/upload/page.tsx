"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import type { GuguApp } from "@/lib/data";
import { categories, labels, type CategoryId } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import { addMyApp } from "@/lib/storage";

// 입력 한 줄을 그리는 작은 도우미 — 폼이 반복되니 묶었어요.
function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: font.body, fontWeight: 600, color: colors.text, marginBottom: 6 }}>
        {label} {required && <span style={{ color: colors.orange }}>*</span>}
      </label>
      <input
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

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<CategoryId>("game");
  const [emoji, setEmoji] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [maker, setMaker] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    // 아주 단순한 검증 — 빈 값이나 잘못된 주소를 막습니다.
    if (title.trim() === "") return setError("작품 이름을 적어 주세요.");
    if (maker.trim() === "") return setError("만든 사람 이름을 적어 주세요.");
    if (url.trim() !== "" && !/^https?:\/\//.test(url.trim())) {
      return setError("주소는 https:// 로 시작해야 해요.");
    }
    if (image.trim() !== "" && !/^https?:\/\//.test(image.trim())) {
      return setError("그림 주소도 https:// 로 시작해야 해요.");
    }

    const newApp: GuguApp = {
      id: `my-${Date.now()}`, // 겹치지 않는 id 자동 생성
      title: title.trim(),
      desc: desc.trim() || "재밌는 작품이에요!",
      category,
      emoji: emoji.trim() || "✨",
      image: image.trim() || undefined,
      url: url.trim(),
      maker: maker.trim(),
    };
    addMyApp(newApp);
    router.push("/nest");
  };

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <button
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            border: `1px solid ${colors.line}`,
            background: colors.surface,
            fontSize: 20,
            cursor: "pointer",
            color: colors.text,
          }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: font.title, fontWeight: 700, color: colors.text }}>
          {labels.uploadTitle}
        </h1>
      </div>

      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <Pigeon size={72} mood="party" />
      </div>

      <Field label="작품 이름" value={title} onChange={setTitle} placeholder="예: 무지개 그림판" required />
      <Field label="한 줄 소개" value={desc} onChange={setDesc} placeholder="예: 손가락으로 그림을 그려요" />

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: font.body, fontWeight: 600, color: colors.text, marginBottom: 6 }}>
          어떤 종류인가요?
        </label>
        <div className="gugu-chips">
          {categories.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                style={{
                  height: 44,
                  padding: "0 16px",
                  borderRadius: 22,
                  border: active ? "none" : `1px solid ${colors.line}`,
                  background: active ? colors.orangeSoft : colors.surface,
                  color: active ? colors.orangeText : colors.text,
                  fontSize: font.body,
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {c.icon} {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="아이콘 (이모지 하나)" value={emoji} onChange={setEmoji} placeholder="예: 🎨 (비우면 ✨)" />
      <Field label="카드 그림 주소 (선택)" value={image} onChange={setImage} placeholder="https://그림주소 (비우면 이모지 표시)" />
      <Field label="실행 주소 (URL)" value={url} onChange={setUrl} placeholder="https://내작품주소 (비우면 준비 중)" />
      <Field label="만든 사람" value={maker} onChange={setMaker} placeholder="예: 홍길동" required />

      {error && (
        <p style={{ color: colors.orange, fontSize: font.sub, margin: "0 0 12px", fontWeight: 600 }}>{error}</p>
      )}

      <RunButton wide label="올리기" onClick={submit} />

      <p style={{ fontSize: font.sub, color: colors.textSub, textAlign: "center", marginTop: 12 }}>
        지금은 이 브라우저에만 저장돼요. 다른 사람과 공유하려면 나중에 서버 연결이 필요해요.
      </p>
    </div>
  );
}
