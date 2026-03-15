"use client";

export function getApiBaseUrl() {
  // На сервере задайте NEXT_PUBLIC_API_URL (например http://prx-iack-dmz01.msk.avito.ru:8000)
  if (typeof window !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_API_URL;
    if (fromEnv) return fromEnv;
    // Если открыто по тому же хосту (не localhost) — бэкенд на том же хосте, порт 8000
    const { hostname } = window.location;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `${window.location.protocol}//${hostname}:8000`;
    }
  }
  return "http://localhost:8000";
}

export function getAuthHeaders() {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("access_token")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

