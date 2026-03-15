"use client";

import { FormEvent, useEffect, useState } from "react";
import { getApiBaseUrl, getAuthHeaders } from "../../lib/api";

type Place = {
  id: number;
  city_id: number;
  name: string;
  latitude: number;
  longitude: number;
  category: string | null;
};

type VisitScenario = {
  id: number;
  user_id: number;
  place_id: number;
  start_time: string;
  end_time: string;
  description: string | null;
};

export default function ProfilePage() {
  const [cityId, setCityId] = useState<number | "">("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [scenarios, setScenarios] = useState<VisitScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newPlace, setNewPlace] = useState({
    name: "",
    latitude: "",
    longitude: "",
    category: "",
  });

  const [newScenario, setNewScenario] = useState({
    place_id: "",
    start_time: "",
    end_time: "",
    description: "",
  });

  useEffect(() => {
    if (!cityId) return;
    void loadPlaces(Number(cityId));
  }, [cityId]);

  async function loadPlaces(city: number) {
    try {
      setError(null);
      const res = await fetch(
        `${getApiBaseUrl()}/places?city_id=${encodeURIComponent(city)}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        },
      );
      if (!res.ok) {
        throw new Error("Не удалось загрузить места");
      }
      const data = await res.json();
      setPlaces(data);
    } catch (err: any) {
      setError(err.message ?? "Ошибка загрузки мест");
    }
  }

  async function loadScenarios() {
    try {
      setError(null);
      const res = await fetch(`${getApiBaseUrl()}/visit-scenarios`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) {
        throw new Error("Не удалось загрузить сценарии");
      }
      const data = await res.json();
      setScenarios(data);
    } catch (err: any) {
      setError(err.message ?? "Ошибка загрузки сценариев");
    }
  }

  useEffect(() => {
    void loadScenarios();
  }, []);

  async function handleAddPlace(e: FormEvent) {
    e.preventDefault();
    if (!cityId) {
      setError("Сначала выбери город (любой ID для MVP)");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/places/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          city_id: Number(cityId),
          name: newPlace.name,
          latitude: Number(newPlace.latitude),
          longitude: Number(newPlace.longitude),
          category: newPlace.category || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? "Не удалось добавить место");
      }
      const place: Place = await res.json();
      setPlaces((prev) => [...prev, place]);
      setNewPlace({ name: "", latitude: "", longitude: "", category: "" });
    } catch (err: any) {
      setError(err.message ?? "Ошибка добавления места");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddScenario(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;
      if (!token) {
        throw new Error("Сначала войди, чтобы создавать сценарии");
      }
      // В реальной версии user_id должен приходить из токена / отдельного запроса.
      // Для MVP можно временно передавать условный user_id, если бэкенд это позволит.
      const res = await fetch(`${getApiBaseUrl()}/visit-scenarios/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          user_id: 1, // TODO: заменить на user_id из JWT / текущего пользователя
          place_id: Number(newScenario.place_id),
          start_time: newScenario.start_time,
          end_time: newScenario.end_time,
          description: newScenario.description || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? "Не удалось добавить сценарий");
      }
      const scenario: VisitScenario = await res.json();
      setScenarios((prev) => [...prev, scenario]);
      setNewScenario({
        place_id: "",
        start_time: "",
        end_time: "",
        description: "",
      });
    } catch (err: any) {
      setError(err.message ?? "Ошибка добавления сценария");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Профиль и места</h1>
      <p className="muted">
        Заполни информацию о себе, выбери город (пока просто ID) и добавь места и
        сценарии.
      </p>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="field">
          <label htmlFor="cityId">Город (ID для MVP)</label>
          <input
            id="cityId"
            type="number"
            min={1}
            value={cityId}
            onChange={(e) =>
              setCityId(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <span className="muted">
            В будущем здесь будет выпадающий список реальных городов из БД.
          </span>
        </div>
      </form>

      <hr style={{ margin: "24px 0", borderColor: "rgba(148,163,184,0.3)" }} />

      <h2>Места</h2>
      <form className="form" onSubmit={handleAddPlace}>
        <div className="field">
          <label htmlFor="placeName">Название места</label>
          <input
            id="placeName"
            value={newPlace.name}
            onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="latitude">Широта</label>
          <input
            id="latitude"
            value={newPlace.latitude}
            onChange={(e) =>
              setNewPlace({ ...newPlace, latitude: e.target.value })
            }
            required
          />
        </div>
        <div className="field">
          <label htmlFor="longitude">Долгота</label>
          <input
            id="longitude"
            value={newPlace.longitude}
            onChange={(e) =>
              setNewPlace({ ...newPlace, longitude: e.target.value })
            }
            required
          />
        </div>
        <div className="field">
          <label htmlFor="category">Категория</label>
          <input
            id="category"
            value={newPlace.category}
            onChange={(e) =>
              setNewPlace({ ...newPlace, category: e.target.value })
            }
            placeholder="бар, кафе, клуб..."
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          Добавить место
        </button>
      </form>

      {places.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p className="muted">Список мест:</p>
          <ul>
            {places.map((p) => (
              <li key={p.id}>
                {p.name} ({p.latitude}, {p.longitude}) — {p.category ?? "—"}
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr style={{ margin: "24px 0", borderColor: "rgba(148,163,184,0.3)" }} />

      <h2>Сценарии посещения</h2>
      <form className="form" onSubmit={handleAddScenario}>
        <div className="field">
          <label htmlFor="placeSelect">Место</label>
          <select
            id="placeSelect"
            value={newScenario.place_id}
            onChange={(e) =>
              setNewScenario({ ...newScenario, place_id: e.target.value })
            }
            required
          >
            <option value="">Выбери место</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="startTime">Время начала (например, 23:00)</label>
          <input
            id="startTime"
            value={newScenario.start_time}
            onChange={(e) =>
              setNewScenario({ ...newScenario, start_time: e.target.value })
            }
            required
          />
        </div>
        <div className="field">
          <label htmlFor="endTime">Время окончания (например, 04:00)</label>
          <input
            id="endTime"
            value={newScenario.end_time}
            onChange={(e) =>
              setNewScenario({ ...newScenario, end_time: e.target.value })
            }
            required
          />
        </div>
        <div className="field">
          <label htmlFor="description">Описание действий</label>
          <textarea
            id="description"
            value={newScenario.description}
            onChange={(e) =>
              setNewScenario({ ...newScenario, description: e.target.value })
            }
            placeholder="что делает, что покупает, с кем приходит..."
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit" disabled={loading}>
          Добавить сценарий
        </button>
      </form>

      {scenarios.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p className="muted">Список сценариев (по всем местам пользователя):</p>
          <ul>
            {scenarios.map((s) => (
              <li key={s.id}>
                {s.start_time}–{s.end_time}, место #{s.place_id}:{" "}
                {s.description ?? "без описания"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

