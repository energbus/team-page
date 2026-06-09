import { NextResponse } from "next/server";
import { getSql, ensureSchema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !message) {
    return NextResponse.json(
      { error: "이름과 상담 내용은 필수입니다." },
      { status: 400 }
    );
  }
  if (name.length > 100 || phone.length > 50 || message.length > 5000) {
    return NextResponse.json(
      { error: "입력 길이가 허용 범위를 초과했습니다." },
      { status: 400 }
    );
  }

  try {
    const sql = getSql();
    await ensureSchema(sql);
    await sql`
      INSERT INTO consultations (name, phone, message)
      VALUES (${name}, ${phone || null}, ${message})
    `;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[consultations] insert failed:", err);
    return NextResponse.json(
      { error: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
