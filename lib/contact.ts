// 제작 의뢰 연락 방법 도우미 — 연락 주소 한 칸으로 세 가지 방법을 알아봅니다.
// 저장은 지금처럼 글자 하나(contact)로만 하고, 화면에서 종류를 판별해요.
// (데이터베이스 변경 없음 — 관리가 쉽고 오류가 적어요)

export type ContactKind = "link" | "email" | "kakaoId" | "none";

// 주소 생김새로 종류를 판별합니다:
// http로 시작 → 채팅 링크 / @가 있으면 → 이메일 / 그 외 글자 → 카카오톡 ID
export function contactKind(contact: string | undefined): ContactKind {
  const c = (contact ?? "").trim();
  if (c === "") return "none";
  if (/^https?:\/\//.test(c)) return "link";
  if (c.includes("@")) return "email";
  return "kakaoId";
}

// 링크를 QR코드 그림으로 바꿔주는 주소 (무료 QR 서비스 goqr.me 사용).
// 휴대폰 카메라로 찍으면 바로 채팅이 열려요. 그림이 안 뜨는 경우를 대비해
// 화면에서는 항상 "바로 연결" 버튼과 복사 버튼을 함께 보여줍니다.
export function qrImageUrl(text: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(text)}`;
}
