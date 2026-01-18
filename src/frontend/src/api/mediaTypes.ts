import { apiFetch } from "./http.ts";

export type MediaTypeDto = {
    id: number;
    name: string;
};

export async function getMediaTypes(params?: { signal?: AbortSignal }): Promise<MediaTypeDto[]> {
    return apiFetch("/media-types", {
        method: "GET",
        signal: params?.signal,
    });
}
