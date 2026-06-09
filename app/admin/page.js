import { getSql, ensureSchema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "상담 내역 (관리자)",
};

function formatDate(value) {
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function AdminPage() {
  let rows = [];
  let dbError = null;

  try {
    const sql = getSql();
    await ensureSchema(sql);
    rows = await sql`
      SELECT id, name, phone, message, created_at
      FROM consultations
      ORDER BY created_at DESC
      LIMIT 500
    `;
  } catch (err) {
    dbError = err.message;
  }

  return (
    <main className="admin">
      <header className="admin-head">
        <h1>상담 내역</h1>
        {!dbError && <span className="admin-count">총 {rows.length}건</span>}
      </header>

      {dbError ? (
        <p className="admin-error">
          데이터를 불러오지 못했습니다. (DB 연결/테이블을 확인해 주세요)
          <br />
          <code>{dbError}</code>
        </p>
      ) : rows.length === 0 ? (
        <p className="admin-empty">아직 접수된 상담이 없습니다.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>접수일시</th>
                <th>이름</th>
                <th>연락처</th>
                <th>상담 내용</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="nowrap">{formatDate(r.created_at)}</td>
                  <td className="nowrap">{r.name}</td>
                  <td className="nowrap">{r.phone || "-"}</td>
                  <td className="msg">{r.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
