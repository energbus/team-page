"use client";

import { useEffect, useState } from "react";

const parts = [
  {
    id: "hr",
    icon: "👥",
    name: "HR 파트",
    tagline: "People & Organization",
    accent: "var(--slack-green)",
    description: "사람과 조직의 성장을 책임지는 파트입니다.",
    duties: [
      "채용 및 인력 운영 관리",
      "인사제도 · 평가 · 보상 설계",
      "교육 · 조직문화 · 복리후생 운영",
    ],
    detail:
      "연간 채용 계획부터 온보딩, 평가·보상 제도 운영, 조직문화 진단까지 구성원의 입사부터 성장 전 과정을 지원합니다.",
  },
  {
    id: "finance",
    icon: "💰",
    name: "재무회계 파트",
    tagline: "Finance & Accounting",
    accent: "var(--slack-blue)",
    description: "회사의 자금과 숫자를 책임지는 파트입니다.",
    duties: [
      "회계 결산 및 재무제표 관리",
      "예산 수립 · 자금 · 세무 관리",
      "경영 실적 분석 및 재무 리포팅",
    ],
    detail:
      "월·분기·연간 결산과 자금 집행, 세무 신고를 담당하며, 경영진이 빠르게 판단할 수 있도록 실적 데이터를 분석해 리포팅합니다.",
  },
];

const toc = [
  { id: "overview", label: "경영기획실 소개" },
  { id: "hr", label: "HR 파트" },
  { id: "finance", label: "재무회계 파트" },
  { id: "contact", label: "문의하기" },
];

export default function Home() {
  const [lecture, setLecture] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState("overview");

  // 강의모드 상태 복원
  useEffect(() => {
    setLecture(localStorage.getItem("lecture") === "1");
  }, []);

  // 스크롤 스파이: 현재 보고 있는 섹션의 목차 항목 하이라이트
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleLecture = () => {
    setLecture((prev) => {
      const next = !prev;
      localStorage.setItem("lecture", next ? "1" : "0");
      return next;
    });
  };

  return (
    <div
      className={`layout${lecture ? " lecture-mode" : ""}${
        drawerOpen ? " drawer-open" : ""
      }`}
    >
      {/* 모바일 상단바 */}
      <header className="topbar">
        <button
          className="hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="메뉴 열기"
        >
          ☰
        </button>
        <div className="brand">
          <span className="dot" />
          경영기획실
        </div>
      </header>

      {/* 모바일 드로어 배경 */}
      <div className="backdrop" onClick={() => setDrawerOpen(false)} />

      {/* 좌측 사이드바 */}
      <aside className="sidebar">
        <div className="brand">
          <span className="dot" />
          경영기획실
        </div>

        <button
          className={`lecture-toggle${lecture ? " on" : ""}`}
          onClick={toggleLecture}
        >
          {lecture ? "✅ 강의모드 ON" : "🎓 강의모드"}
        </button>

        <nav className="toc">
          {toc.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className={active === t.id ? "active" : ""}
              onClick={() => setDrawerOpen(false)}
            >
              {t.label}
            </a>
          ))}
        </nav>

        <p className="side-hint optional">
          강의모드를 켜면 글자가 커지고 세부 설명이 숨겨져, 발표·강의 화면에
          적합한 화면으로 바뀝니다.
        </p>
      </aside>

      {/* 우측 본문 */}
      <main className="content">
        <section id="overview" className="doc-section">
          <span className="badge">Strategy &amp; Planning</span>
          <h1>경영기획실</h1>
          <p className="lead">
            회사의 비전과 전략을 설계하고, 사람과 자금이 한 방향으로 나아가도록
            돕습니다.
          </p>
          <p className="optional">
            경영기획실은 <strong>HR 파트</strong>와{" "}
            <strong>재무회계 파트</strong>로 구성되어, 조직과 재무 양 축에서
            회사의 의사결정을 뒷받침합니다.
          </p>
        </section>

        {parts.map((p) => (
          <section id={p.id} key={p.id} className="doc-section">
            <article className="card" style={{ "--accent": p.accent }}>
              <div className="icon">{p.icon}</div>
              <span className="card-tagline">{p.tagline}</span>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <ul className="duties">
                {p.duties.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </article>
            <p className="detail optional">{p.detail}</p>
          </section>
        ))}

        <section id="contact" className="doc-section">
          <div className="contact">
            <div className="accent-row">
              <span style={{ background: "var(--slack-green)" }} />
              <span style={{ background: "var(--slack-blue)" }} />
              <span style={{ background: "var(--slack-yellow)" }} />
              <span style={{ background: "var(--slack-red)" }} />
            </div>
            <h2>함께 일하고 싶으신가요?</h2>
            <p>업무 협업, 채용, 그 어떤 이야기든 편하게 연락 주세요.</p>
            <a
              className="button-primary button-inverse"
              href="mailto:energbus@gmail.com"
            >
              문의하기
            </a>
          </div>
        </section>

        <footer className="footer">
          © {new Date().getFullYear()} 경영기획실. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
