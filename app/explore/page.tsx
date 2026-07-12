"use client";

import { Suspense, useState, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import AppCard from "@/components/AppCard";
import CategoryChip from "@/components/CategoryChip";
import Pigeon from "@/components/Pigeon";
import { apps } from "@/lib/data";
import { categories, labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";

function ExploreContent() {
  const params = useSearchParams();
  const initialCat = params.get("cat") ?? "all";
  const [cat, setCat] = useState<string>(initialCat);
  const [query, setQuery] = useState("");

  const list = apps.filter((a) => {
    const catOk = cat === "all" || a.category === cat;
    const q = query.trim();
    const queryOk = q === "" || a.title.includes(q) || a.desc.includes(q);
    return catOk && queryOk;
  });

  return (
    <div style={{ padding: "20px 16px" }}>
      <h1 style={{ margin: "0 4px 14px", fontSize: font.title, fontWeight: 700, color: colors.text }}>
        {labels.explore}
      </h1>

      <input
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        placeholder="무엇을 찾고 있나요?"
        style={{
          width: "100%",
          height: 48,
          borderRadius: 24,
          border: `1px solid ${colors.line}`,
          background: colors.surface,
          padding: "0 18px",
          fontSize: font.body,
          color: colors.text,
          outline: "none",
          marginBottom: 14,
        }}
      />

      <div className="gugu-chips" style={{ marginBottom: 14 }}>
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
        <div className="gugu-list">
          {list.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  );
}
