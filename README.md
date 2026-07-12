# 구구마켓 🕊️

사람들이 만든 신기한 앱을 바로 해보는 놀이터.

## 지금 버전에 들어 있는 것

- 홈 (오늘의 추천 + 카테고리)
- 구경 (카테고리 필터 + 검색)
- 실행 화면 (iframe 임베드 + "새 창에서 하기" 폴백 + 담기)
- 내 둥지 (담은 것 / 해본 것 — 브라우저에 저장, 로그인 없이 동작)
- 오류 화면, 404 화면 (비둘기가 안내)

데이터베이스 없이 돌아가는 테스트 버전입니다. 로그인·Supabase는 다음 단계에서 붙입니다.

## 내 컴퓨터에서 테스트하기

1. [Node.js](https://nodejs.org) LTS 버전 설치 (이미 있다면 생략)
2. 이 폴더에서 터미널을 열고:

```bash
npm install
npm run dev
```

3. 브라우저에서 http://localhost:3000 접속

## Vercel에 배포하기 (빌트마켓과 같은 방법)

1. GitHub에 새 저장소를 만들고 이 폴더를 올립니다
2. vercel.com → Add New → Project → 저장소 선택 → Deploy
3. 끝. 설정할 환경 변수 없음.

## 내 작품 올리기

`lib/data.ts` 파일을 열고 목록에 한 덩어리를 추가하면 됩니다:

```ts
{
  id: "my-app",              // 영문, 겹치지 않게
  title: "내 멋진 앱",
  desc: "한 줄 소개",
  category: "game",          // game / test / tool / make / study / fun
  emoji: "🎯",
  url: "https://내앱주소",    // 배포된 주소. 비우면 "준비 중" 표시
  maker: "제작자 이름",
  minutes: 3,                // 선택
},
```

## 자주 고치게 될 파일

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 색 | `lib/theme.ts` |
| 문구·용어·카테고리 | `lib/labels.ts` |
| 작품 목록 | `lib/data.ts` |
| 기능 켜고 끄기 | `lib/features.ts` |

## 참고

- 어떤 사이트는 보안 설정 때문에 iframe 안에 안 뜹니다. 그럴 땐 실행 화면의 "새 창에서 하기" 버튼이 대신 열어 줍니다.
- 담기/해본 것 기록은 지금은 각자의 브라우저에 저장됩니다. 브라우저를 바꾸면 기록이 따라가지 않아요 (Supabase를 붙이면 해결).
- `bilt_product_id` 자리(`lib/data.ts`의 `biltProductId`)는 나중에 빌트마켓 연동용으로 비워 두었습니다.
