// 끼워넣기 주소 도우미 — 유튜브 링크를 화면 안에서 재생 가능한 형태로 바꿔줍니다.
// 유튜브는 일반 시청 주소(watch?v=...)를 다른 사이트 화면 안에 넣는 것을 막지만,
// 전용 embed 주소는 허용해요. 노래·영상 작품을 올릴 때 메이커는 그냥
// 유튜브 링크를 복사해 붙이면 되고, 변환은 여기서 자동으로 됩니다.
// 유튜브가 아닌 주소는 그대로 돌려줘요.
export function embedFriendlyUrl(url: string): string {
  const m = (url ?? "").match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return url;
}
