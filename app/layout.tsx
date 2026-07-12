import type { Metadata } from "next";
import { labels } from "@/lib/labels";
import { colors } from "@/lib/theme";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: `${labels.serviceName} — ${labels.tagline}`,
  description: "사람들이 만든 신기한 앱을 바로 해보는 놀이터",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ background: colors.bg }}>
        <main
          style={{
            maxWidth: 480,
            margin: "0 auto",
            minHeight: "100vh",
            paddingBottom: 72,
          }}
        >
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
