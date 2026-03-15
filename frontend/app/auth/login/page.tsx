"use client";

import { FormEvent, useState } from "react";
import { getApiBaseUrl } from "../../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = new URLSearchParams();
      body.set("username", email);
      body.set("password", password);

      const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? "Ошибка входа");
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      window.location.href = "/profile";
    } catch (err: any) {
      setError(err.message ?? "Не удалось войти");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Вход</h1>
      <p className="muted">Введи email и пароль, чтобы войти.</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </div>
  );
}

