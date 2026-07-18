"use client";

import { Suspense, useState, useEffect, type ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import type { GuguApp } from "@/lib/data";
import { categories, labels, type CategoryId } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import { addMyApp, getMyApps, updateMyApp } from "@/lib/storage";

// 입력 한 줄을 그리는 작은 도우미
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

// 고른 그림 파일을 카드에 알맞은 크기로 줄여서 돌려줍니다.
// (큰 사진을 그대로 저장하면 브라우저 저장 공간이 금방 차서, 자동으로 줄여요)
function readAndResize(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 640; // 카드용으로 충분한 크기
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => reject(new Error("image"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
}

function UploadContent() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit"); // 수정 모드면 작품 id가 들어와요
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<CategoryId>("game");
  const [image, setImage] = useState(""); // 줄여진 그림 (없으면 빈 문자열)
  const [url, setUrl] = useState("");
  const [maker, setMaker] = useState("");
  const [error, setError] = useState("");

  // 수정 모드면 기존 내용을 칸에 채워 넣습니다.
  useEffect(() => {
    if (!editId) return;
    const found = getMyApps().find((a) => a.id === editId);
    if (found) {
      setTitle(found.title);
      setDesc(found.desc);
      setCategory(found.category);
      setImage(found.image ?? "");
      setUrl(found.url);
      setMaker(found.maker);
    }
  }, [editId]);

  // 그림 파일을 골랐을 때
  const pickImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const resized = await readAndResize(file);
      setImage(resized);
      setError("");
    } catch {
      setError("그림을 불러오지 못했어요. 다른 그림으로 해보세요.");
    }
  };

  const submit = () => {
    if (title.trim() === "") return setError("작품 이름을 적어 주세요.");
    if (maker.trim() === "") return setError("만든 사람 이름을 적어 주세요.");
    if (url.trim() !== "" && !/^https?:\/\//.test(url.trim())) {
      return setError("주소는 https:// 로 시작해야 해요.");
    }

    // 아이콘은 고른 종류에 맞춰 자동으로 정해집니다.
    const catIcon = categories.find((c) => c.id === category)?.icon ?? "✨";

    if (editId) {
      // 수정 모드 — 기존 작품을 찾아 내용만 바꿉니다 (올린 시각·숨김 상태는 유지).
      const existing = getMyApps().find((a) => a.id === editId);
      if (existing) {
        updateMyApp({
          ...existing,
          title: title.trim(),
          desc: desc.trim() || "재밌는 작품이에요!",
          category,
          emoji: catIcon,
          image: image || undefined,
          url: url.trim(),
          maker: maker.trim(),
        });
        router.push("/nest");
        return;
      }
    }

    const newApp: GuguApp = {
      id: `my-${Date.now()}`,
      title: title.trim(),
      desc: desc.trim() || "재밌는 작품이에요!",
      category,
      emoji: catIcon,
      image: image || undefined,
      url: url.trim(),
      maker: maker.trim(),
      createdAt: Date.now(),
    };
    addMyApp(newApp);
    router.push("/nest");
  };

  return (
    <div style={{ padding: "20px 16px", maxWidth: 560, margin: "0 auto" }}>
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
          {editId ? "작품 수정하기" : labels.uploadTitle}
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

      {/* 게임 그림 넣기 — 내 컴퓨터/휴대폰에서 그림 파일을 고릅니다 */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: font.body, fontWeight: 600, color: colors.text, marginBottom: 6 }}>
          작품 그림 (선택)
        </label>
        {image ? (
          <div>
            <img
              src={image}
              alt="고른 그림 미리보기"
              style={{
                width: "100%",
                maxHeight: 240,
                objectFit: "cover",
                borderRadius: 16,
                border: `1px solid ${colors.line}`,
                display: "block",
              }}
            />
            <button
              onClick={() => setImage("")}
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
              그림 빼기
            </button>
          </div>
        ) : (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              height: 96,
              borderRadius: 16,
              border: `2px dashed ${colors.mochaDeep}`,
              background: colors.surface,
              color: colors.textSub,
              fontSize: font.body,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📷 게임/앱 화면 그림 고르기
            <input type="file" accept="image/*" onChange={pickImage} style={{ display: "none" }} />
          </label>
        )}
        <p style={{ margin: "6px 2px 0", fontSize: font.sub, color: colors.textSub }}>
          게임 화면을 캡처한 그림을 넣으면 카드에 크게 보여요. 없으면 종류 아이콘이 대신 나와요.
        </p>
      </div>

      <Field label="실행 주소 (URL)" value={url} onChange={setUrl} placeholder="https://내작품주소 (비우면 준비 중)" />
      <Field label="만든 사람" value={maker} onChange={setMaker} placeholder="예: 홍길동" required />

      {error && (
        <p style={{ color: colors.orange, fontSize: font.sub, margin: "0 0 12px", fontWeight: 600 }}>{error}</p>
      )}

      <RunButton wide label={editId ? "저장하기" : "올리기"} onClick={submit} />

      <p style={{ fontSize: font.sub, color: colors.textSub, textAlign: "center", marginTop: 12 }}>
        지금은 이 브라우저에만 저장돼요. 다른 사람과 공유하려면 나중에 서버 연결이 필요해요.
      </p>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense>
      <UploadContent />
    </Suspense>
  );
}
