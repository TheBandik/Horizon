import { apiFetch } from "./http.ts";

export type GenreDto = {
    id: number;
    name: string;
};

export async function getGenres(params?: { signal?: AbortSignal }): Promise<GenreDto[]> {
    return apiFetch("/genre", {
        method: "GET",
        signal: params?.signal,
    });
}
