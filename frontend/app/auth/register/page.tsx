"use client";

import { FormEvent, useState } from "react";
import { getApiBaseUrl } from "../../../lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name: name || null,
          age: age === "" ? null : Number(age),
          gender: gender || null,
          interests: interests || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? "Ошибка регистрации");
      }

      window.location.href = "/auth/login";
    } catch (err: any) {
      setError(err.message ?? "Не удалось зарегистрироваться");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Регистрация</h1>
      <p className="muted">Создай аккаунт и заполни анкету позже в профиле.</p>
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
        <div className="field">
          <label htmlFor="name">Имя / ник (опционально)</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="age">Возраст (опционально)</label>
          <input
            id="age"
            type="number"
            min={0}
            value={age}
            onChange={(e) =>
              setAge(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>
        <div className="field">
          <label htmlFor="gender">Пол (опционально)</label>
          <input
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="м/ж/другое"
          />
        </div>
        <div className="field">
          <label htmlFor="interests">Интересы (опционально)</label>
          <textarea
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="музыка, бары, стендап..."
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Регистрируем..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
}

