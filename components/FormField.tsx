"use client";

import { type ChangeEvent } from "react";
import { colors, font } from "@/lib/theme";

// 공용 입력칸 — 로그인, 올리기, 비밀번호 화면이 전부 이 하나를 씁니다.
// 입력칸 모양(높이, 둥글기, 색)을 바꾸고 싶으면 이 파일만 고치면 앱 전체가 바뀌어요.
export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  multiline = false, // true면 여러 줄 입력칸(설명 등)이 됩니다
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: font.body,
          fontWeight: 600,
          color: colors.text,
          marginBottom: 6,
        }}
      >
        {label} {required && <span style={{ color: colors.orange }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{
            width: "100%",
            borderRadius: 14,
            border: `1px solid ${colors.line}`,
            background: colors.surface,
            padding: "12px 16px",
            fontSize: font.body,
            color: colors.text,
            outline: "none",
            lineHeight: 1.6,
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 14,
            border: `1px solid ${colors.line}`,
            background: colors.surface,
            padding: "0 16px",
            fontSize: font.body,
            color: colors.text,
            outline: "none",
          }}
        />
      )}
    </div>
  );
}
