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

export type ExternalGameSearchItem = {
    provider: "RAWG";
    externalId: string;
    title: string;
    released: string | null;
    poster: string | null;
    alreadyImported: boolean;
};

export type MixedMediaSearchResponse = {
    local: MediaResponse[];
    rawg: ExternalGameSearchItem[];
};

// ===== Search =====
export async function searchMixedMedia(params: {
    q: string;
    mediaTypeId: string;
    signal: AbortSignal;
}): Promise<MixedMediaSearchResponse> {
    const q = (params.q ?? "").trim();

    const qs = new URLSearchParams({
        q,
        mediaTypeId: String(params.mediaTypeId),
    });

    return apiFetch<MixedMediaSearchResponse>(`/search/media?${qs.toString()}`, {
        method: "GET",
        signal: params.signal,
    });
}

export async function importRawgGame(params: {
    externalId: string;
    signal?: AbortSignal;
}): Promise<MediaResponse> {
    return apiFetch<MediaResponse>(`/external/rawg/import`, {
        method: "POST",
        body: JSON.stringify({ externalId: params.externalId }),
        headers: { "Content-Type": "application/json" },
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

    return apiFetch<void>("/media", {
        method: "POST",
        body: form,
        signal: params.signal,
    });
}
