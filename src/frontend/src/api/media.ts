import { apiFetch } from "./http.ts";

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

// ===== Search =====
export async function searchMedia(params: {
    q: string;
    page: number;
    size: number;
    mediaTypeId: string;
    signal: AbortSignal
}): Promise<PageResponse<MediaResponse>> {
    const page = params.page ?? 0;
    const size = params.size ?? 10;

    const query = (params.q ?? "").trim();

    const qs = new URLSearchParams({
        query,
        page: String(page),
        size: String(size),
        mediaTypeId: String(params.mediaTypeId)
    });

    return apiFetch<PageResponse<MediaResponse>>(`/api/media/search?${qs.toString()}`, {
        method: "GET",
        signal: params.signal,
    });
}

// ===== Create (JSON + poster) =====
export type MediaCreateRequest = {
    title: string;
    originalTitle: string | null;
    releaseDate: string;
    mediaTypeId: number;
    series: number[];
    genres: number[];
};

export async function createMedia(params: {
    request: MediaCreateRequest;
    poster?: File | null;
    signal?: AbortSignal;
}): Promise<void> {

    console.log(params.request);

    const form = new FormData();

    form.append("data", new Blob([JSON.stringify(params.request)], { type: "application/json" }));

    if (params.poster) {
        form.append("poster", params.poster);
    }

    return apiFetch<void>("/api/media", {
        method: "POST",
        body: form,
        signal: params.signal,
    });
}
