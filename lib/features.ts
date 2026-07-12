// 기능 스위치 — true/false만 바꾸면 기능이 켜지고 꺼집니다. 재배포는 필요하지만 코드 수정은 필요 없어요.
export const features = {
  reactions: true,   // 이모지 반응
  saving: true,      // 담기 (내 둥지)
  comments: false,   // 댓글 — 2단계
  badges: false,     // 배지 수집 — 3단계
  biltLink: false,   // 빌트마켓 구매 연결 — 나중에
} as const;
