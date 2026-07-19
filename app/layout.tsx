import type { Metadata } from "next";
import { labels } from "@/lib/labels";
import { colors } from "@/lib/theme";
import { features } from "@/lib/features";
import TopNav from "@/components/TopNav";
import BiltBar from "@/components/BiltBar";
import "./globals.css";

export const metadata: Metadata = {
  title: `${labels.serviceName} — ${labels.tagline}`,
  description: "사람들이 만든 신기한 앱을 바로 해보는 놀이터",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ background: colors.bg }}>
        <TopNav />
        {/* 빌트마켓 바가 켜지면 바 높이만큼 하단 여백 추가 (같은 스위치에 연동) */}
        <main className="gugu-shell" style={features.biltButtons ? { paddingBottom: 100 } : undefined}>
          {children}
        </main>
        <BiltBar />
      </body>
    </html>
  );
}
