"use client";

import { Suspense, useState, useEffect, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import AppCard from "@/components/AppCard";
import CategoryChip from "@/components/CategoryChip";
import Pigeon from "@/components/Pigeon";
import type { GuguApp } from "@/lib/data";
import { getAllApps, matchesQuery } from "@/lib/catalog";
import { getPlayed } from "@/lib/storage";
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
    // 최근에 본 작품이 앞에 오도록 정렬합니다.
    // getPlayed()는 최근 본 순서대로 id를 돌려줘요.
    const all = getAllApps();
    const playedIds = getPlayed();
    const rank = (a: GuguApp) => {
      const i = playedIds.indexOf(a.id);
      return i === -1 ? playedIds.length : i; // 본 적 없으면 뒤로
    };
    setApps([...all].sort((a, b) => rank(a) - rank(b)));
  }, []);

  const list = apps.filter((a) => {
    const catOk = cat === "all" || a.category === cat;
    return catOk && matchesQuery(a, query);
  });

  return (
    <div style={{ padding: "16px 16px 24px" }}>
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
        <div>
          <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
            <Pigeon size={80} mood="empty" />
            <p style={{ fontSize: font.body, color: colors.textSub }}>찾는 작품이 없구구.</p>
          </div>
          {/* 빈손으로 보내지 않기 — 대신 추천 작품을 보여줍니다 */}
          {apps.length > 0 && (
            <div>
              <h2 style={{ margin: "8px 4px 12px", fontSize: font.cardTitle, fontWeight: 700, color: colors.text }}>
                대신 이런 건 어때요?
              </h2>
              <div className="gugu-grid">
                {apps.slice(0, 6).map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </div>
          )}
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
