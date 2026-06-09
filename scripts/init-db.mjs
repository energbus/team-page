import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error(
    "❌ DATABASE_URL(또는 POSTGRES_URL) 환경변수가 없습니다. `vercel env pull` 후 다시 실행하세요."
  );
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS consultations (
    id         BIGSERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    phone      TEXT,
    message    TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

console.log("✅ consultations 테이블 준비 완료");
