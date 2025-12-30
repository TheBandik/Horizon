import { apiFetch } from "./http.ts";

export type StatusScope = "ALL" | "MOVIE" | "BOOK" | "GAME";

export type StatusDto = {
    id: number;
    name: string;
    code: string;
    scope: StatusScope;
};

export async function getStatuses(params?: { signal?: AbortSignal }): Promise<StatusDto[]> {
    return apiFetch("/api/status", { method: "GET", signal: params?.signal });
}
