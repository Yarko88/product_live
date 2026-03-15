"use client";

import { useEffect, useState } from "react";
import { getApiBaseUrl, getAuthHeaders } from "../../lib/api";

type CharacterOnMap = {
  character_id: number;
  user_id: number;
  city_id: number;
  avatar_type: string | null;
  status_text: string | null;
  current_place:
    | {
        id: number;
        name: string;
        latitude: number;
        longitude: number;
        category: string | null;
      }
    | null;
};

export default function CityPage() {
  const [cityId, setCityId] = useState<number | "">("");
  const [data, setData] = useState<CharacterOnMap[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityId) return;
    const interval = setInterval(() => {
      void loadData(Number(cityId));
    }, 5000);
    void loadData(Number(cityId));
    return () => clearInterval(interval);
  }, [cityId]);

  async function loadData(city: number) {
    try {
      setError(null);
      const res = await fetch(
        `${getApiBaseUrl()}/map/characters/current?city_id=${encodeURIComponent(city)}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        },
      );
      if (!res.ok) {
        throw new Error("Не удалось получить данные для карты");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message ?? "Ошибка загрузки карты");
    }
  }

  // Простейшая "карта" — координатная сетка.
  // TODO: заменить на реальный компонент Яндекс.Карт с SDK.
  const minLat = Math.min(
    ...data
      .map((d) => d.current_place?.latitude ?? 0)
      .filter((v) => v !== 0 && !Number.isNaN(v)),
    0,
  );
  const maxLat = Math.max(
    ...data
      .map((d) => d.current_place?.latitude ?? 0)
      .filter((v) => v !== 0 && !Number.isNaN(v)),
    0,
  );
  const minLng = Math.min(
    ...data
      .map((d) => d.current_place?.longitude ?? 0)
      .filter((v) => v !== 0 && !Number.isNaN(v)),
    0,
  );
  const maxLng = Math.max(
    ...data
      .map((d) => d.current_place?.longitude ?? 0)
      .filter((v) => v !== 0 && !Number.isNaN(v)),
    0,
  );

  function project(lat: number, lng: number) {
    const latSpan = maxLat - minLat || 1;
    const lngSpan = maxLng - minLng || 1;
    const x = ((lng - minLng) / lngSpan) * 100;
    const y = ((lat - minLat) / latSpan) * 100;
    return { x, y: 100 - y };
  }

  return (
    <div className="card">
      <h1>Карта города (заглушка)</h1>
      <p className="muted">
        Ниже — упрощённая карта. Персонажи отображаются как точки по их
        координатам.
      </p>

      <div className="form" style={{ marginBottom: 16 }}>
        <div className="field">
          <label htmlFor="city">Город (ID)</label>
          <input
            id="city"
            type="number"
            min={1}
            value={cityId}
            onChange={(e) =>
              setCityId(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div
        style={{
          position: "relative",
          borderRadius: 16,
          border: "1px solid rgba(148,163,184,0.4)",
          background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.25), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.25), transparent 55%)",
          height: 360,
          overflow: "hidden",
        }}
      >
        {/* TODO: заменить этот блок на реальный компонент Яндекс.Карт.
            Здесь должен быть вызов JS SDK Яндекс.Карт, добавление слоёв и маркеров.
            В этом же месте можно будет включить "живую анимацию" движения персонажей
            между точками маршрута. */}
        {data.map((item) => {
          if (!item.current_place) return null;
          const { x, y } = project(
            item.current_place.latitude,
            item.current_place.longitude,
          );
          return (
            <div
              key={item.character_id}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "999px",
                  background:
                    "linear-gradient(135deg, #6366f1, #ec4899)",
                  boxShadow: "0 0 0 4px rgba(99,102,241,0.4)",
                }}
              />
              {item.status_text && (
                <div
                  style={{
                    marginTop: 4,
                    padding: "4px 8px",
                    borderRadius: 999,
                    background: "rgba(15,23,42,0.9)",
                    border: "1px solid rgba(148,163,184,0.6)",
                    fontSize: 11,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.status_text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="muted" style={{ marginTop: 12 }}>
        TODO: здесь же будет логика плавного перемещения персонажей по времени
        сценариев — интерполяция между точками, анимация и обновление позиций по
        WebSocket или периодическому опросу API.
      </p>
    </div>
  );
}

