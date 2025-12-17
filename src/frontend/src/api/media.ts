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

export type ApiError = {
    code: string;
    message: string;
    status: number;
    path: string;
    timestamp: string;
    details: Record<string, string>;
};

const API_URL = import.meta.env.VITE_API_URL;

async function parseApiError(response: Response): Promise<ApiError | null> {
    try {
        const data = (await response.json()) as ApiError;
        if (data && typeof data.code === "string") return data;
    } catch {
        // ignore
    }
    return null;
}

export async function searchMedia(params: {
    q: string;
    page?: number;
    size?: number;
    signal?: AbortSignal;
}): Promise<PageResponse<MediaResponse>> {
    const page = params.page ?? 0;
    const size = params.size ?? 10;

    const url = new URL(`${API_URL}/api/media/search`);
    url.searchParams.set("query", params.q);
    url.searchParams.set("page", String(page));
    url.searchParams.set("size", String(size));

    const response = await fetch(url.toString(), { signal: params.signal });

    if (!response.ok) {
        const err = await parseApiError(response);
        if (err) throw err;
        throw new Error("Search failed");
    }

    return response.json();
}
