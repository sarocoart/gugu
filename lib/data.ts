import type { CategoryId } from "./labels";

export type GuguApp = {
  id: string;
  title: string;
  desc: string;        // 한 줄 소개
  category: CategoryId;
  emoji: string;       // 임시 썸네일 (그림이 없을 때 표시)
  image?: string;      // 카드에 보일 그림 주소 (있으면 이모지 대신 표시)
  url: string;         // 실행 URL — 비워두면 "준비 중" 표시
  maker: string;       // 제작자 이름
  tags?: string[];     // 검색 단어 — 제목에 없는 말로도 찾아지게 (예: ["운동","건강"])
  contact?: string;    // 연락 받을 주소 — 오픈채팅 링크 또는 이메일 (제작 의뢰용)
  minutes?: number;    // 소요 시간(분), 선택
  createdAt?: number;  // 올린 시각 — 7일 안이면 NEW 배지가 붙어요
  hidden?: boolean;    // true면 홈에서 숨겨져요 (내가 올린 것에서만 보임)
  views?: number;      // 조회수 — 서버에서 함께 내려옵니다
  biltProductId?: string; // 빌트마켓 연동용 자리 (지금은 비움)
};

// ============================================================
// 작품 목록 — 새 작품을 올리려면 아래에 한 덩어리 추가하면 끝!
//
// 추가 예시 (복사해서 쓰세요):
// {
//   id: "my-app",              // 영문, 겹치지 않게
//   title: "내 멋진 앱",
//   desc: "한 줄 소개",
//   category: "game",          // game / test / tool / make / study / fun
//   emoji: "🎯",
//   url: "https://내앱주소",
//   maker: "제작자 이름",
//   minutes: 3,
// },
// ============================================================
export const apps: GuguApp[] = [
  // 기본 제공 작품은 이제 없습니다 — 모든 작품은 "새 작품 올리기"로 올려요.
  // 코드로 직접 넣고 싶을 때는 위 주석의 예시를 복사해서 여기에 추가하면 됩니다.
];

export function getApp(id: string): GuguApp | undefined {
  return apps.find((a) => a.id === id);
}
