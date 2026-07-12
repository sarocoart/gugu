"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors } from "@/lib/theme";
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
