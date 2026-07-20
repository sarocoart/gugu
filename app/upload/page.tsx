"use client";

import { Suspense, useState, useEffect, useMemo, type ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import type { GuguApp } from "@/lib/data";
import { categories, labels, categoryTags, keywordTags, type CategoryId } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import { fetchApp, fetchMyApps, insertApp, updateApp } from "@/lib/catalog";
import { getCurrentUser, type GuguUser } from "@/lib/supabase";
import Field from "@/components/FormField";

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
  const [tagsText, setTagsText] = useState(""); // 검색 단어 (쉼표로 구분)
  const [contact, setContact] = useState(""); // 연락 받을 주소 (오픈채팅/이메일)
  const [error, setError] = useState("");
  const [user, setUser] = useState<GuguUser | null>(null);
  const [checked, setChecked] = useState(false); // 로그인 확인이 끝났는지
  const [myOldTags, setMyOldTags] = useState<string[]>([]); // 내가 전에 쓴 검색 단어들

  // 로그인 상태 확인 — 작품은 계정에 붙어 저장되므로 로그인이 필요해요.
  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setChecked(true);
    });
  }, []);

  // 내가 전에 올린 작품들의 검색 단어를 모아둡니다 (많이 쓴 순서).
  // "비슷한 작품을 또 올릴 때" 한 번의 클릭으로 같은 단어를 붙일 수 있어요.
  useEffect(() => {
    if (!user) return;
    let alive = true;
    fetchMyApps(user.id).then((list) => {
      if (!alive) return;
      const count = new Map<string, number>();
      list.forEach((a) => (a.tags ?? []).forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
      const sorted = Array.from(count.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([t]) => t);
      setMyOldTags(sorted);
    });
    return () => {
      alive = false;
    };
  }, [user]);

  // 수정 모드면 서버에서 기존 내용을 불러와 칸에 채워 넣습니다.
  useEffect(() => {
    if (!editId) return;
    (async () => {
      const found = await fetchApp(editId);
      if (found) {
        setTitle(found.title);
        setDesc(found.desc);
        setCategory(found.category);
        setImage(found.image ?? "");
        setUrl(found.url);
        setMaker(found.maker);
        setTagsText((found.tags ?? []).join(", "));
        setContact(found.contact ?? "");
      }
    })();
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

  // 추천 검색 단어 — ① 내가 전에 쓴 단어 ② 제목·소개 속 단어 ③ 종류 기본 단어 순서로,
  // 이미 적어 넣은 단어는 빼고 최대 8개까지 보여줍니다. (그림을 보고 추천하려면
  // AI 호출이 필요해서 여기서는 글자 기반으로만 추천해요)
  const currentTags = useMemo(
    () =>
      tagsText
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
    [tagsText]
  );

  const suggestions = useMemo(() => {
    const text = `${title} ${desc}`;
    const pool: string[] = [];
    myOldTags.forEach((t) => pool.push(t));
    keywordTags.forEach((k) => {
      if (text.includes(k.find)) k.tags.forEach((t) => pool.push(t));
    });
    (categoryTags[category] ?? []).forEach((t) => pool.push(t));
    const seen = new Set<string>();
    const out: string[] = [];
    pool.forEach((t) => {
      if (!seen.has(t) && !currentTags.includes(t)) {
        seen.add(t);
        out.push(t);
      }
    });
    return out.slice(0, 8);
  }, [title, desc, category, myOldTags, currentTags]);

  // 추천 단어를 누르면 검색 단어 칸 뒤에 붙습니다.
  const addTag = (t: string) => {
    setTagsText(currentTags.concat(t).join(", "));
  };

  const submit = async () => {
    if (title.trim() === "") return setError("작품 이름을 적어 주세요.");
    if (maker.trim() === "") return setError("만든 사람 이름을 적어 주세요.");
    if (url.trim() !== "" && !/^https?:\/\//.test(url.trim())) {
      return setError("주소는 https:// 로 시작해야 해요.");
    }

    // 아이콘은 고른 종류에 맞춰 자동으로 정해집니다.
    const catIcon = categories.find((c) => c.id === category)?.icon ?? "✨";

    // 검색 단어: "운동, 건강" → ["운동","건강"]
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    if (editId) {
      // 수정 모드 — 서버의 기존 작품을 찾아 내용만 바꿉니다.
      const existing = await fetchApp(editId);
      if (existing) {
        const ok = await updateApp({
          ...existing,
          title: title.trim(),
          desc: desc.trim() || "재밌는 작품이에요!",
          category,
          emoji: catIcon,
          image: image || undefined,
          url: url.trim(),
          maker: maker.trim(),
          tags: tags.length > 0 ? tags : undefined,
          contact: contact.trim() || undefined,
        });
        if (!ok) return setError("저장하지 못했어요. 내 작품이 맞는지, 로그인 상태인지 확인해 주세요.");
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
      tags: tags.length > 0 ? tags : undefined,
      contact: contact.trim() || undefined,
      createdAt: Date.now(),
    };
    const ok = await insertApp(newApp);
    if (!ok) return setError("올리지 못했어요. 로그인 상태를 확인하고 다시 시도해 주세요.");
    router.push("/nest");
  };

  // 로그인 안 한 상태 — 작품을 계정에 붙여 저장해야 하므로 로그인으로 안내합니다.
  if (checked && !user) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Pigeon size={90} mood="hello" />
        <p style={{ fontSize: font.body, color: colors.text, margin: "14px 0 6px", fontWeight: 600 }}>
          작품을 올리려면 로그인해 주세요!
        </p>
        <p style={{ fontSize: font.sub, color: colors.textSub, margin: "0 0 18px" }}>
          로그인하면 어느 기기에서든 내 작품을 관리할 수 있어요.
        </p>
        <RunButton label="로그인 하러 가기" onClick={() => router.push("/login")} />
      </div>
    );
  }

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
      <Field
        label="작품 소개"
        value={desc}
        onChange={setDesc}
        placeholder="작품을 소개해 주세요. 여러 줄로 길게 적어도 좋아요."
        multiline
      />

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
      <Field
        label="검색 단어 (선택)"
        value={tagsText}
        onChange={setTagsText}
        placeholder="쉼표로 구분해요. 예: 운동, 건강, 스트레칭"
      />
      {suggestions.length > 0 && (
        <div style={{ margin: "-6px 0 16px" }}>
          <p style={{ margin: "0 2px 6px", fontSize: font.sub, color: colors.textSub }}>
            추천 단어 — 누르면 위 칸에 추가돼요
          </p>
          <div className="gugu-chips">
            {suggestions.map((t) => (
              <button
                key={t}
                onClick={() => addTag(t)}
                style={{
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 20,
                  border: "none",
                  background: colors.mint,
                  color: colors.mintText,
                  fontSize: font.sub,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                + {t}
              </button>
            ))}
          </div>
        </div>
      )}
      <Field
        label="제작 의뢰 받을 주소 (선택)"
        value={contact}
        onChange={setContact}
        placeholder="카카오 오픈채팅 링크 또는 이메일"
      />

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
