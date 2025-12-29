import { getToken, clearToken } from "./auth/token.ts";

const API_BASE = import.meta.env.VITE_API_URL;

let onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(fn: () => void) {
    onUnauthorized = fn;
}

export async function apiFetch<T>(
    path: string,
    init: RequestInit = {}
): Promise<T> {
    const headers = new Headers(init.headers);

    headers.set("Content-Type", "application/json");

    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

    if (res.status === 401) {
        clearToken();
        onUnauthorized?.();
        throw { code: 'UNAUTHORIZED' };
    }

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP_${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        return undefined as T;
    }

    return (await res.json()) as T;
}
