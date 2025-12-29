import {apiFetch} from "./http.ts";

export type MediaTypeResponse = {
    id: number;
    code: string;
    name: string;
};

export type MediaResponse = {
    id: number;
    title: string | null;
    originalTitle: string | null;
    poster: string | null;
    releaseDate: string | null;
    mediaType: MediaTypeResponse;
};

export type PageResponse<T> = {
    items: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

export async function searchMedia(params: {
    q: string;
    page?: number;
    size?: number;
    signal?: AbortSignal;
}): Promise<PageResponse<MediaResponse>> {
    const page = params.page ?? 0;
    const size = params.size ?? 10;

    const qs = new URLSearchParams({
        query: params.q,
        page: String(page),
        size: String(size),
    });

    return apiFetch<PageResponse<MediaResponse>>(`/api/media/search?${qs.toString()}`, {
        method: 'GET',
        signal: params.signal,
    });
}
