"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Pigeon from "@/components/Pigeon";
import AppCard from "@/components/AppCard";
import CategoryChip from "@/components/CategoryChip";
import BigTextToggle from "@/components/BigTextToggle";
import type { GuguApp } from "@/lib/data";
import { getAllApps } from "@/lib/catalog";
import { categories, labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<GuguApp[]>([]);

  useEffect(() => {
    setFeatured(getAllApps().slice(0, 6));
  }, []);

  return (
    <div>
      <header
        style={{
          background: colors.mocha,
          padding: "24px 20px 28px",
          textAlign: "center",
          borderRadius: "0 0 28px 28px",
          position: "relative",
        }}
      >
        <div className="gugu-mobile-only" style={{ position: "absolute", top: 16, right: 16 }}>
          <BigTextToggle />
        </div>
        <Pigeon size={88} mood="hello" />
        <h1 style={{ margin: "10px 0 2px", fontSize: font.title, fontWeight: 700, color: colors.text }}>
          {labels.serviceName}
        </h1>
        <p style={{ margin: 0, fontSize: font.body, color: colors.textSub }}>{labels.tagline}</p>
      </header>

      <section style={{ padding: "20px 16px 8px" }}>
        <h2 style={{ margin: "0 4px 12px", fontSize: font.cardTitle, fontWeight: 600, color: colors.text }}>
          {labels.categoriesTitle}
        </h2>
        <div className="gugu-chips">
          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              name={c.name}
              icon={c.icon}
              active={false}
              onClick={() => router.push(`/explore?cat=${c.id}`)}
            />
          ))}
        </div>
      </section>

      <section style={{ padding: "12px 16px" }}>
        <h2 style={{ margin: "0 4px 12px", fontSize: font.cardTitle, fontWeight: 600, color: colors.text }}>
          {labels.todayTitle}
        </h2>
        <div className="gugu-grid">
          {featured.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>
    </div>
  );
}
