"use client";

import { useState } from "react";

export default function ConsultForm() {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      message: fd.get("message"),
    };

    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "전송에 실패했습니다.");
      }
      form.reset();
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success">
        <strong>상담 신청이 접수되었습니다. 🙌</strong>
        <p>빠른 시일 내에 연락드리겠습니다.</p>
        <button
          type="button"
          className="button-secondary"
          onClick={() => setStatus("idle")}
        >
          새 상담 신청하기
        </button>
      </div>
    );
  }

  return (
    <form className="consult-form" onSubmit={handleSubmit}>
      <label>
        이름 <span className="req">*</span>
        <input
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder="홍길동"
        />
      </label>
      <label>
        연락처(전화)
        <input
          name="phone"
          type="tel"
          maxLength={50}
          placeholder="010-1234-5678"
        />
      </label>
      <label>
        상담 내용 <span className="req">*</span>
        <textarea
          name="message"
          required
          maxLength={5000}
          rows={5}
          placeholder="문의하실 내용을 자유롭게 적어주세요."
        />
      </label>

      {status === "error" && <p className="form-error">⚠️ {error}</p>}

      <button
        type="submit"
        className="button-primary"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "전송 중…" : "상담 신청하기"}
      </button>
    </form>
  );
}
