"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { labels } from "@/lib/labels";
import { links } from "@/lib/features";
import { colors, font } from "@/lib/theme";
import { supabase, getCurrentUser, type GuguUser } from "@/lib/supabase";

// 하단 바와 같은 메뉴를 씁니다 — 한 곳(navItems)에서 관리하려고 분리했어요.
export const navItems = [
  { href: "/", label: labels.home, icon: "🏠" },
  { href: "/nest", label: labels.mypage, icon: "🕊️" },
];

// PC에서만 보이는 상단 가로 바. 모바일에선 CSS(.gugu-topnav)가 숨깁니다.
// 왼쪽: 로고 + 로그인(로그아웃) / 오른쪽: 홈 · 내 둥지 · 빌트마켓 GO!
export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<GuguUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, [pathname]); // 화면 이동 시 로그인 상태를 다시 확인합니다

  const logout = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
    } catch {
      // 무시 — 아래에서 상태는 비웁니다
    }
    setUser(null);
    router.push("/");
  };

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
        }}
      >
        {labels.serviceName} 🕊️
      </Link>

      {/* 로고 바로 옆 — 로그인/로그아웃 */}
      {user ? (
        <button
          onClick={logout}
          style={{
            height: 40,
            padding: "0 16px",
            borderRadius: 20,
            border: `1px solid ${colors.line}`,
            background: colors.surface,
            color: colors.textSub,
            fontSize: font.sub,
            fontWeight: 600,
            cursor: "pointer",
            marginRight: "auto",
          }}
        >
          {user.nickname}님 · 로그아웃
        </button>
      ) : (
        <Link
          href="/login"
          style={{
            height: 40,
            lineHeight: "40px",
            padding: "0 16px",
            borderRadius: 20,
            border: `1px solid ${colors.line}`,
            background: colors.surface,
            color: colors.text,
            fontSize: font.sub,
            fontWeight: 600,
            textDecoration: "none",
            marginRight: "auto",
          }}
        >
          👤 로그인
        </Link>
      )}

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

      {/* 홈·내 둥지 옆 — 빌트마켓 GO! (새 탭) */}
      <a
        href={links.bilt}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          height: 40,
          lineHeight: "40px",
          padding: "0 18px",
          borderRadius: 20,
          background: colors.orange,
          color: "#FFFFFF",
          fontSize: font.sub,
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        🛒 빌트마켓 GO!
      </a>
    </nav>
  );
}
