import { NextResponse } from "next/server";

// /admin 이하 모든 경로를 HTTP Basic 인증으로 보호한다.
// 자격증명은 ADMIN_USER / ADMIN_PASSWORD 환경변수에서 읽는다.
export function middleware(request) {
  // CLI 등으로 값 끝에 개행이 섞일 수 있어 trim 후 비교한다.
  const user = process.env.ADMIN_USER?.trim();
  const pass = process.env.ADMIN_PASSWORD?.trim();

  // 자격증명이 설정되지 않았으면 접근 차단 (fail-closed)
  if (!user || !pass) {
    return new NextResponse("관리자 인증이 설정되지 않았습니다.", {
      status: 503,
    });
  }

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const sep = decoded.indexOf(":");
      const u = decoded.slice(0, sep);
      const p = decoded.slice(sep + 1);
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    } catch {
      // fall through to 401
    }
  }

  return new NextResponse("인증이 필요합니다.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
