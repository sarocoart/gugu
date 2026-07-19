// 기능 스위치 — true/false만 바꾸면 기능이 켜지고 꺼집니다. 재배포는 필요하지만 코드 수정은 필요 없어요.
export const features = {
  reactions: true,   // 이모지 반응
  saving: true,      // 담기 (내 둥지)
  comments: false,   // 댓글 — 2단계
  badges: false,     // 배지 수집 — 3단계
  biltLink: false,   // 빌트마켓 구매 연결 — 나중에
  biltButtons: false, // 빌트마켓 GO!·가기 버튼 표시 — true로 바꾸면 다시 보여요
} as const;

// 서로 오가는 주소 — 바뀌면 여기만 고치면 됩니다.
export const links = {
  bilt: "https://marketplace-lake-one.vercel.app", // 빌트마켓 (거래소)
} as const;
