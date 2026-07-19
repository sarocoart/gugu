"use client";

import { Suspense, useState, useEffect, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import AppCard from "@/components/AppCard";
import CategoryChip from "@/components/CategoryChip";
import Pigeon from "@/components/Pigeon";
import type { GuguApp } from "@/lib/data";
import { fetchAllApps, matchesQuery, migrateLocalWorks } from "@/lib/catalog";
import { getPlayed } from "@/lib/storage";
import { categories, labels } from "@/lib/labels";
import { links, features } from "@/lib/features";
import { colors, font } from "@/lib/theme";

// 첫 화면 = 검색 + 카테고리 + 전체 작품. (구경 화면과 합쳤습니다)
function HomeContent() {
  const params = useSearchParams();
  const initialCat = params.get("cat") ?? "all";
  const [cat, setCat] = useState<string>(initialCat);
  const [query, setQuery] = useState("");
  const [apps, setApps] = useState<GuguApp[]>([]);

  useEffect(() => {
    // 서버에서 전체 작품을 불러온 뒤, 최근에 본 작품이 앞에 오도록 정렬합니다.
    let alive = true;
    (async () => {
      await migrateLocalWorks(); // 옛 브라우저 저장 작품이 있으면 서버로 이사 (한 번만)
      const all = await fetchAllApps();
      const playedIds = getPlayed();
      const rank = (a: GuguApp) => {
        const i = playedIds.indexOf(a.id);
        return i === -1 ? playedIds.length : i; // 본 적 없으면 뒤로
      };
      if (alive) setApps([...all].sort((a, b) => rank(a) - rank(b)));
    })();
    return () => {
      alive = false;
    };
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
        placeholder="검색"
        style={{
          display: "block",
          width: "100%",
          maxWidth: 560,
          margin: "0 auto 14px",
          height: 52,
          borderRadius: 26,
          border: `1px solid ${colors.line}`,
          background: colors.surface,
          padding: "0 20px",
          fontSize: font.body,
          color: colors.text,
          outline: "none",
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

      {/* 빌트마켓으로 가는 다리 — features.biltButtons로 켜고 끕니다 */}
      {features.biltButtons && (
      <section style={{ padding: "28px 0 8px" }}>
        <div
          style={{
            background: colors.mocha,
            borderRadius: 20,
            padding: "22px 16px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: font.cardTitle, fontWeight: 700, color: colors.text }}>
            내가 만든 작품, 팔아보고 싶다면?
          </p>
          <p style={{ margin: "0 0 14px", fontSize: font.sub, color: colors.textSub }}>
            빌트마켓은 만든 것을 사고파는 곳이에요
          </p>
          <a
            href={links.bilt}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              height: 48,
              lineHeight: "48px",
              padding: "0 24px",
              borderRadius: 24,
              background: colors.orange,
              color: "#FFFFFF",
              fontSize: font.body,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            🛒 빌트마켓 가기
          </a>
        </div>
      </section>
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
