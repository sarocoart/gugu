// 구구마켓 브랜드 색 — 색을 바꾸고 싶으면 이 파일만 고치면 됩니다.
export const colors = {
  bg: "#F7F4F0",        // 앱 전체 배경 (파스텔 모카 그레이, 가장 연함)
  surface: "#FFFFFF",   // 카드 배경
  mocha: "#EAE3DC",     // 헤더, 넓은 면
  mochaDeep: "#C9BDB2", // 비둘기 몸통, 진한 면
  line: "#E5DDD4",      // 옅은 테두리
  orange: "#EF9A5D",    // 포인트 — "하기" 버튼 전용
  orangeSoft: "#F5C9A0",// 오렌지 연한 면
  orangeText: "#6B3D14",// 오렌지 면 위 글자
  mint: "#C4E5D6",      // 보조 — 카테고리, 상태
  mintText: "#1F5C45",  // 민트 면 위 글자
  text: "#453B32",      // 본문 글자 (진한 브라운 — 대비 확보)
  textSub: "#8A7D70",   // 보조 글자
  active: "#C77A3C",    // 하단 메뉴 현재 위치
} as const;

// 글자 크기 — 아이·어르신 기준으로 넉넉하게
export const font = {
  title: 22,
  cardTitle: 17,
  body: 16,
  sub: 13,
  button: 17,
} as const;
