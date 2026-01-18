import { apiFetch } from "./http.ts";

export type SeriesDto = {
    id: number;
    title: string;
};

export async function getSeries(params?: { signal?: AbortSignal }): Promise<SeriesDto[]> {
    return apiFetch("/series", {
        method: "GET",
        signal: params?.signal,
    });
}
