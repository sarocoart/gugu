// 끼워넣기 주소 도우미 — 유튜브·인스타그램 링크를 화면 안에서
// 재생 가능한 형태로 바꿔줍니다. 두 서비스 모두 일반 주소를 다른 사이트
// 화면 안에 넣는 것을 막지만, 전용 embed 주소는 허용해요.
// 메이커는 그냥 링크를 복사해 붙이면 되고, 변환은 여기서 자동으로 됩니다.
// 유튜브·인스타그램이 아닌 주소는 그대로 돌려줘요.
export function embedFriendlyUrl(url: string): string {
  const u = url ?? "";
  // 유튜브: watch / youtu.be / shorts / live → embed
  const yt = u.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // 인스타그램: 게시물(p)·릴스(reel/reels) → 뒤에 /embed 붙이기
  const ig = u.match(/instagram\.com\/(p|reel|reels)\/([\w-]+)/);
  if (ig) {
    const kind = ig[1] === "p" ? "p" : "reel";
    return `https://www.instagram.com/${kind}/${ig[2]}/embed`;
  }
  return u;
}
