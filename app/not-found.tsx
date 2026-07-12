import Link from "next/link";
import Pigeon from "@/components/Pigeon";
import { labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <Pigeon size={100} mood="empty" />
      <p style={{ fontSize: font.body, color: colors.text, margin: "16px 0 20px" }}>
        {labels.notFound}
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          height: 48,
          lineHeight: "48px",
          padding: "0 24px",
          borderRadius: 24,
          background: colors.orange,
          color: "#FFFFFF",
          fontSize: font.button,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        홈으로
      </Link>
    </div>
  );
}
