// 구구마켓 용어 — 문구를 바꾸고 싶으면 이 파일만 고치면 됩니다.
export const labels = {
  serviceName: "구구마켓",
  tagline: "오늘 뭐 해보지?",
  home: "홈",
  explore: "구경",
  mypage: "마이 페이지",
  saved: "담은 것",
  played: "해본 것",
  follow: "단골",
  run: "GO!",
  runNewTab: "크게 하기",
  homeTagline: "👀 눈과 두뇌가 즐거운 인지 놀이 게임 모음 ✨",
  save: "담기",
  savedDone: "담았어요",
  unsave: "담기 취소",
  emptyNest: "아직 담은 게 없구구! 구경하러 가볼까요?",
  emptyPlayed: "아직 해본 게 없구구! 하나 해볼까요?",
  uploadTitle: "새 작품 올리기",
  uploadButton: "새 작품 올리기",
  uploadDone: "올렸어요! 목록에서 확인해 보세요.",
  removeConfirm: "정말 지울까요?",
  remove: "지우기",
  cancel: "취소",
  myUploads: "내가 올린 것",
  loadError: "비둘기가 길을 잃었구구. 다시 시도해 주세요.",
  notFound: "이 둥지에는 아무것도 없구구.",
  demoNotReady: "이 작품은 아직 준비 중이구구.",
  categoriesTitle: "무엇을 해볼까요?",
  todayTitle: "오늘의 추천",
  allCategory: "전체",
} as const;

// 카테고리 — 추가/삭제/수정은 이 목록에서만 하면 됩니다 (관리자용 안내):
//   추가: 아래에 { id: "영어이름", name: "화면 이름", icon: "이모지" } 한 줄을 넣으세요.
//   삭제: 그 줄을 지우면 됩니다. (이미 그 종류로 올라간 작품은 사라지지 않고,
//         카드에는 기본 아이콘으로 표시되며 "전체"에서 계속 보여요)
//   원하면 아래 categoryTags에 추천 단어 한 줄을 같이 넣을 수 있어요 (없어도 동작).
export const categories = [
  { id: "game", name: "게임", icon: "🎮" },
  { id: "test", name: "테스트", icon: "🔮" },
  { id: "tool", name: "꿀도구", icon: "🛠️" },
  { id: "make", name: "만들기", icon: "🎨" },
  { id: "study", name: "공부", icon: "📚" },
  { id: "fun", name: "재미", icon: "😂" },
  { id: "video", name: "영상", icon: "📺" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

// 실행 버튼 글자 — 모든 카드가 이 함수를 씁니다.
// 지금은 어디서나 "GO!" 하나로 통일. (labels.run만 바꾸면 전체가 바뀝니다)
// 예전처럼 "게임 GO!"로 되돌리고 싶으면 아래 주석 줄을 대신 쓰면 돼요.
export function runLabel(categoryId: string): string {
  void categoryId; // 지금은 종류를 쓰지 않지만, 규칙을 되돌릴 때를 위해 남겨둡니다.
  return labels.run;
  // const cat = categories.find((c) => c.id === categoryId);
  // return cat ? `${cat.name} ${labels.run}` : labels.run;
}

// 추천 검색 단어 재료 — 올리기 화면에서 씁니다. 단어를 늘리고 싶으면 여기만 고치세요.
// 1) 종류별 기본 단어
// 종류별 추천 단어 — 종류를 추가해도 여기는 채우지 않아도 됩니다 (선택 사항).
export const categoryTags: Partial<Record<CategoryId, string[]>> = {
  game: ["게임", "놀이", "재미"],
  test: ["테스트", "심리", "궁합"],
  tool: ["도구", "생활", "편리"],
  make: ["만들기", "그림", "창작"],
  study: ["공부", "학습", "퀴즈"],
  fun: ["재미", "웃음", "심심풀이"],
  video: ["영상", "노래", "음악", "시니어"],
};

// 2) 제목·소개에 이 단어가 들어 있으면 → 이 태그들을 추천
export const keywordTags: Array<{ find: string; tags: string[] }> = [
  { find: "아기", tags: ["아기", "아이"] },
  { find: "아이", tags: ["아이"] },
  { find: "어린이", tags: ["아이"] },
  { find: "눈", tags: ["눈운동"] },
  { find: "운동", tags: ["운동", "건강"] },
  { find: "스트레칭", tags: ["운동", "건강"] },
  { find: "건강", tags: ["건강"] },
  { find: "그림", tags: ["그림"] },
  { find: "색칠", tags: ["그림", "색칠"] },
  { find: "퍼즐", tags: ["퍼즐"] },
  { find: "기억", tags: ["기억력"] },
  { find: "숫자", tags: ["숫자"] },
  { find: "계산", tags: ["계산"] },
  { find: "한글", tags: ["한글"] },
  { find: "영어", tags: ["영어"] },
  { find: "음악", tags: ["음악"] },
  { find: "동물", tags: ["동물"] },
  { find: "강아지", tags: ["동물", "강아지"] },
  { find: "고양이", tags: ["동물", "고양이"] },
  { find: "우주", tags: ["우주"] },
  { find: "별", tags: ["우주"] },
  { find: "과일", tags: ["과일"] },
  { find: "요리", tags: ["요리"] },
  { find: "여행", tags: ["여행"] },
  { find: "달리", tags: ["달리기"] },
  { find: "타자", tags: ["타자연습"] },
  { find: "시계", tags: ["시계"] },
  { find: "날씨", tags: ["날씨"] },
];
