import "./globals.css";

export const metadata = {
  title: "경영기획실 — 팀 소개",
  description: "경영기획실이 하는 일을 소개합니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
