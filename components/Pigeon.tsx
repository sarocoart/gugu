import { colors } from "@/lib/theme";

type Mood = "hello" | "empty" | "party";

// 구구마켓 마스코트 비둘기. mood로 표정이 바뀝니다.
export default function Pigeon({ size = 96, mood = "hello" }: { size?: number; mood?: Mood }) {
  const eyeY = mood === "empty" ? 33 : 31;
  return (
    <svg
      viewBox="0 0 120 100"
      width={size}
      height={(size * 100) / 120}
      role="img"
      aria-label="구구마켓 비둘기"
      style={{ display: "block", margin: "0 auto" }}
    >
      <ellipse cx="60" cy="62" rx="34" ry="28" fill={colors.mochaDeep} />
      <circle cx="60" cy="34" r="20" fill="#D6CCC2" />
      <ellipse cx="38" cy="60" rx="12" ry="18" fill="#BBAEA2" transform="rotate(20 38 60)" />
      {mood === "party" ? (
        <>
          <path d="M50 31 q3 -4 6 0" stroke={colors.text} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M64 31 q3 -4 6 0" stroke={colors.text} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="53" cy={eyeY} r="3" fill={colors.text} />
          <circle cx="67" cy={eyeY} r="3" fill={colors.text} />
        </>
      )}
      <path d="M57 39 L63 39 L60 44 Z" fill={colors.orange} />
      <ellipse cx="60" cy="88" rx="16" ry="4" fill="#DDD3C9" />
    </svg>
  );
}
