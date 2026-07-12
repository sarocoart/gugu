"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import BigTextToggle from "./BigTextToggle";

// 하단 바와 같은 메뉴를 씁니다 — 한 곳(navItems)에서 관리하려고 분리했어요.
export const navItems = [
  { href: "/", label: labels.home, icon: "🏠" },
  { href: "/explore", label: labels.explore, icon: "🔍" },
  { href: "/nest", label: labels.mypage, icon: "🕊️" },
];

// PC에서만 보이는 상단 가로 바. 모바일에선 CSS(.gugu-topnav)가 숨깁니다.
export default function TopNav() {
  const pathname = usePathname();
  return (
    <nav
      className="gugu-topnav"
      style={{
        alignItems: "center",
        gap: 24,
        padding: "14px 24px",
        background: colors.surface,
        borderBottom: `1px solid ${colors.line}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: font.title,
          fontWeight: 700,
          color: colors.text,
          textDecoration: "none",
          marginRight: "auto",
        }}
      >
        {labels.serviceName} 🕊️
      </Link>
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              fontSize: font.body,
              fontWeight: active ? 600 : 400,
              color: active ? colors.active : colors.textSub,
              textDecoration: "none",
            }}
          >
            <span aria-hidden="true">{item.icon}</span> {item.label}
          </Link>
        );
      })}
      <BigTextToggle />
    </nav>
  );
}
