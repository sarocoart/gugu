"use client";

import Pigeon from "@/components/Pigeon";
import RunButton from "@/components/RunButton";
import { labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <Pigeon size={100} mood="empty" />
      <p style={{ fontSize: font.body, color: colors.text, margin: "16px 0 20px" }}>
        {labels.loadError}
      </p>
      <RunButton label="다시 시도" onClick={() => reset()} />
    </div>
  );
}
