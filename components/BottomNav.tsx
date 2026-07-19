"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors } from "@/lib/theme";
import { links, features } from "@/lib/features";
import { navItems } from "./TopNav";

// 모바일에서만 보이는 하단 바. PC에선 CSS(.gugu-bottomnav)가 숨깁니다.
// 메뉴 항목은 TopNav의 navItems를 그대로 가져다 써서 한 곳에서만 관리합니다.
export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="gugu-bottomnav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.surface,
        borderTop: `1px solid ${colors.line}`,
        maxWidth: 480,
        margin: "0 auto",
        zIndex: 10,
      }}
    >
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              padding: "16px 0 18px",
              textAlign: "center",
              textDecoration: "none",
              color: colors.text,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: active ? 700 : 500 }}>{item.label}</span>
          </Link>
        );
      })}
      {/* 홈·내 둥지 옆 — 빌트마켓 GO! (새 탭으로 열려요) */}
      {features.biltButtons && (
      <a
        href={links.bilt}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          padding: "10px 0 12px",
          textAlign: "center",
          textDecoration: "none",
          color: colors.active,
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 22, display: "block" }}>
          🛒
        </span>
        <span style={{ fontSize: 12, fontWeight: 600 }}>빌트마켓 GO!</span>
      </a>
      )}
    </nav>
  );
}
