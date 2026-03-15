import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live City Map",
  description: "Живая карта города с персонажами",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="logo">
              Live City
            </Link>
            <nav className="nav">
              <Link href="/auth/login">Вход</Link>
              <Link href="/auth/register">Регистрация</Link>
              <Link href="/profile">Профиль</Link>
              <Link href="/city">Карта города</Link>
            </nav>
          </div>
        </header>
        <main className="page">{children}</main>
      </body>
    </html>
  );
}

