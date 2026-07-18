// 코드에 내장된 작품(data.ts)과 사용자가 올린 작품(storage)을 하나로 합쳐서 다룹니다.
// 화면들은 이 파일만 가져다 쓰면 양쪽 작품을 모두 볼 수 있습니다.
import { apps as builtinApps, type GuguApp } from "./data";
import { getMyApps } from "./storage";

// 전체 작품 = 내가 올린 것(위) + 기본 제공(아래)
// 숨긴 작품(hidden)은 여기서 빠져서 홈·추천에 안 나옵니다.
export function getAllApps(): GuguApp[] {
  return [...getMyApps().filter((a) => !a.hidden), ...builtinApps];
}

// id로 작품 하나 찾기 — 숨긴 작품도 찾습니다.
// (내가 올린 것에서 GO!를 눌러 확인해볼 수 있어야 하니까요)
export function findApp(id: string): GuguApp | undefined {
  return [...getMyApps(), ...builtinApps].find((a) => a.id === id);
}
