"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { labels } from "@/lib/labels";
import { links, features } from "@/lib/features";
import { colors, font } from "@/lib/theme";
import { supabase, getCurrentUser, type GuguUser } from "@/lib/supabase";

// 하단 바와 같은 메뉴를 씁니다 — 한 곳(navItems)에서 관리하려고 분리했어요.
export const navItems = [
  { href: "/", label: labels.home },
  { href: "/nest", label: labels.mypage },
];

// PC에서만 보이는 상단 가로 바. 모바일에선 CSS(.gugu-topnav)가 숨깁니다.
// 왼쪽: 로그인(로그아웃) / 정중앙: 구구마켓 로고 / 오른쪽: 홈 · 내 둥지 · 빌트마켓 GO!
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
        padding: "14px 20px",
        background: colors.surface,
        borderBottom: `1px solid ${colors.line}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* 왼쪽 — 로그인/로그아웃 */}
      {user ? (
        <button
          onClick={logout}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: colors.text,
            fontSize: font.body,
            fontWeight: 500,
            cursor: "pointer",
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
          }}
        >
          로그인
        </Link>
      )}

      {/* 정중앙 — 구구마켓 로고 (글자와 비둘기를 세로 중앙 정렬) */}
      <Link
        href="/"
        className="gugu-logo"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          alignItems: "center",
          fontSize: font.title,
          fontWeight: 700,
          color: colors.text,
          textDecoration: "none",
        }}
      >
        구구마켓
      </Link>

      {/* 홈 · 마이 페이지 — 홈은 PC에서 오른쪽으로 밀리는 클래스(gugu-nav-home) */}
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={item.href === "/" ? "gugu-nav-home" : undefined}
            style={{
              fontSize: font.body,
              fontWeight: active ? 700 : 500,
              color: colors.text,
              textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        );
      })}
      {features.biltButtons && (
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
      )}
    </nav>
  );
}
