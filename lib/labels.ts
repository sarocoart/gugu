// 구구마켓 용어 — 문구를 바꾸고 싶으면 이 파일만 고치면 됩니다.
export const labels = {
  serviceName: "구구마켓",
  tagline: "오늘 뭐 해보지?",
  home: "홈",
  explore: "구경",
  mypage: "내 둥지",
  saved: "담은 것",
  played: "해본 것",
  follow: "단골",
  run: "GO!",
  runNewTab: "새 창에서 하기",
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

// 카테고리 — 추가/수정은 여기서만
export const categories = [
  { id: "game", name: "게임", icon: "🎮" },
  { id: "test", name: "테스트", icon: "🔮" },
  { id: "tool", name: "꿀도구", icon: "🛠️" },
  { id: "make", name: "만들기", icon: "🎨" },
  { id: "study", name: "공부", icon: "📚" },
  { id: "fun", name: "재미", icon: "😂" },
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
