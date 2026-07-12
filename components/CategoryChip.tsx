"use client";

import { colors, font } from "@/lib/theme";

export default function CategoryChip({
  name,
  icon,
  active,
  onClick,
}: {
  name: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 44,
        padding: "0 16px",
        borderRadius: 22,
        border: active ? "none" : `1px solid ${colors.line}`,
        background: active ? colors.orangeSoft : colors.surface,
        color: active ? colors.orangeText : colors.text,
        fontSize: font.body,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {icon ? `${icon} ` : ""}
      {name}
    </button>
  );
}
