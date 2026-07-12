import type { CategoryId } from "./labels";

export type GuguApp = {
  id: string;
  title: string;
  desc: string;        // 한 줄 소개
  category: CategoryId;
  emoji: string;       // 임시 썸네일 (나중에 이미지로 교체)
  url: string;         // 실행 URL — 비워두면 "준비 중" 표시
  maker: string;       // 제작자 이름
  minutes?: number;    // 소요 시간(분), 선택
  biltProductId?: string; // 빌트마켓 연동용 자리 (지금은 비움)
};

// 작품 목록 — 새 작품을 올리려면 여기에 한 덩어리 추가하면 끝!
// url에 배포된 주소를 넣으면 실행 화면에서 바로 열립니다.
export const apps: GuguApp[] = [
  {
    id: "mbti-test",
    title: "MBTI 심리테스트",
    desc: "3분 만에 알아보는 내 성격 유형",
    category: "test",
    emoji: "🔮",
    url: "https://marketplace-lake-one.vercel.app",
    maker: "구구",
    minutes: 3,
  },
  {
    id: "fruit-match",
    title: "과일 짝맞추기",
    desc: "같은 과일을 찾아요. 쉬워요!",
    category: "game",
    emoji: "🍎",
    url: "",
    maker: "구구",
    minutes: 5,
  },
  {
    id: "allowance-calc",
    title: "용돈 계산기",
    desc: "한 달 용돈을 계획해 봐요",
    category: "tool",
    emoji: "🧮",
    url: "",
    maker: "구구",
  },
  {
    id: "profile-maker",
    title: "프로필 그림 만들기",
    desc: "나만의 귀여운 프로필을 만들어요",
    category: "make",
    emoji: "🎨",
    url: "",
    maker: "구구",
  },
  {
    id: "word-quiz",
    title: "낱말 퀴즈",
    desc: "오늘의 낱말, 맞혀 볼까요?",
    category: "study",
    emoji: "📚",
    url: "",
    maker: "구구",
    minutes: 5,
  },
  {
    id: "balance-game",
    title: "밸런스 게임",
    desc: "둘 중 하나만 골라야 한다면?",
    category: "fun",
    emoji: "⚖️",
    url: "",
    maker: "구구",
    minutes: 2,
  },
];

export function getApp(id: string): GuguApp | undefined {
  return apps.find((a) => a.id === id);
}
