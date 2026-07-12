"use client";

// 구경 화면은 첫 화면과 합쳐졌습니다.
// 예전 주소(/explore)로 들어와도 카테고리를 유지한 채 홈으로 보내줍니다.
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ExploreRedirect() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const cat = params.get("cat");
    router.replace(cat ? `/?cat=${cat}` : "/");
  }, [router, params]);

  return null;
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreRedirect />
    </Suspense>
  );
}
