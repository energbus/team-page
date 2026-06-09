import { neon } from "@neondatabase/serverless";

// 서버 전용 DB 클라이언트. 절대 클라이언트 컴포넌트에서 import 하지 말 것.
// 연결 문자열은 Vercel(Neon 연동) 환경변수에서만 읽는다.
export function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL(또는 POSTGRES_URL) 환경변수가 설정되지 않았습니다."
    );
  }
  return neon(url);
}

// 테이블이 없으면 생성한다(멱등). 첫 사용 시 스키마를 자동 준비한다.
export async function ensureSchema(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS consultations (
      id         BIGSERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      phone      TEXT,
      message    TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}
