"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { labels } from "@/lib/labels";
import { colors } from "@/lib/theme";

const items = [
  { href: "/", label: labels.home, icon: "🏠" },
  { href: "/explore", label: labels.explore, icon: "🔍" },
  { href: "/nest", label: labels.mypage, icon: "🕊️" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        background: colors.surface,
        borderTop: `1px solid ${colors.line}`,
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              padding: "10px 0 12px",
              textAlign: "center",
              textDecoration: "none",
              color: active ? colors.active : colors.textSub,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 22, display: "block" }}>
              {item.icon}
            </span>
            <span style={{ fontSize: 12, fontWeight: active ? 600 : 400 }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
