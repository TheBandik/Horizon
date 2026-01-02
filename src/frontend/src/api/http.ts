import { getToken, clearToken } from "./auth/token.ts";

const API_BASE = import.meta.env.VITE_API_URL;

let onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(fn: () => void) {
    onUnauthorized = fn;
}

function isFormData(body: unknown): body is FormData {
    return typeof FormData !== "undefined" && body instanceof FormData;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);

    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    if (isFormData(init.body)) {
        headers.delete("Content-Type");
    } else {
        if (init.body != null && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
    }

    const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

    if (res.status === 401) {
        clearToken();
        onUnauthorized?.();
        throw { code: "UNAUTHORIZED" };
    }

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP_${res.status}`);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        return undefined as T;
    }

    return (await res.json()) as T;
}
