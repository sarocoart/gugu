"use client";

import { Suspense, useState, useEffect, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import AppCard from "@/components/AppCard";
import CategoryChip from "@/components/CategoryChip";
import Pigeon from "@/components/Pigeon";
import type { GuguApp } from "@/lib/data";
import { getAllApps } from "@/lib/catalog";
import { categories, labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";

// 첫 화면 = 검색 + 카테고리 + 전체 작품. (구경 화면과 합쳤습니다)
function HomeContent() {
  const params = useSearchParams();
  const initialCat = params.get("cat") ?? "all";
  const [cat, setCat] = useState<string>(initialCat);
  const [query, setQuery] = useState("");
  const [apps, setApps] = useState<GuguApp[]>([]);

  useEffect(() => {
    setApps(getAllApps());
  }, []);

  const list = apps.filter((a) => {
    const catOk = cat === "all" || a.category === cat;
    const q = query.trim();
    const queryOk = q === "" || a.title.includes(q) || a.desc.includes(q);
    return catOk && queryOk;
  });

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      {/* 모바일에서만 보이는 작은 브랜드 줄 (PC엔 상단 바가 있어서 숨김) */}
      <div
        className="gugu-mobile-only"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}
      >
        <Pigeon size={40} mood="hello" />
        <span style={{ fontSize: font.title, fontWeight: 700, color: colors.text }}>
          {labels.serviceName}
        </span>
      </div>

      <input
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        placeholder="무엇을 해볼까요? 이름으로 찾아요"
        style={{
          width: "100%",
          height: 52,
          borderRadius: 26,
          border: `1px solid ${colors.line}`,
          background: colors.surface,
          padding: "0 20px",
          fontSize: font.body,
          color: colors.text,
          outline: "none",
          marginBottom: 14,
        }}
      />

      <div className="gugu-chips" style={{ marginBottom: 16 }}>
        <CategoryChip name={labels.allCategory} active={cat === "all"} onClick={() => setCat("all")} />
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            name={c.name}
            icon={c.icon}
            active={cat === c.id}
            onClick={() => setCat(c.id)}
          />
        ))}
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Pigeon size={80} mood="empty" />
          <p style={{ fontSize: font.body, color: colors.textSub }}>찾는 작품이 없구구.</p>
        </div>
      ) : (
        <div className="gugu-grid">
          {list.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
