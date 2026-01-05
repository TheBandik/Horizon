import { apiFetch } from "./http";

export type DatePrecision = "DAY" | "MONTH" | "YEAR";

export type MediaUserCreateRequest = {
    mediaId: number;
    statusId: number;
    rating: number | null;
    eventDate: string | null;
    precision: DatePrecision | null;
};

export type MediaUserUpdateRequest = {
    statusId: number | null;
    rating: number | null;
};

export type MediaUserResponse = {
    id: number;
    mediaId: number;
    userId: number;
    statusId: number;
    rating: number | null;

    eventDate?: string | null;
    precision?: DatePrecision | null;
};

export type MediaUserItem = {
    id: number;
    media: {
        id: number;
        title: string | null;
        originalTitle: string | null;
        poster: string | null;
        releaseDate: string | null;
        mediaType: {
            id: number;
            name: string;
        };
    };
    status: {
        id: number;
        name: string;
    };
    rating: number | null;
    lastEventDate: string | null;
};

export type MediaUserHistoryItem = {
    id: number;
    eventDate: string | null;
    precision: DatePrecision | null;
};

export type MediaUserDetailsResponse = {
    id: number;
    mediaId: number;
    userId: number;
    statusId: number;
    rating: number | null;
    firstEventDate: string | null;
    lastEventDate: string | null;
    historyCount: number;
    history: MediaUserHistoryItem[];
};

export type MediaUserHistoryRequest = {
    eventDate: string | null;
    precision: DatePrecision | null;
};

export async function createMediaUser(params: {
    body: MediaUserCreateRequest;
    signal?: AbortSignal;
}): Promise<MediaUserResponse> {
    return apiFetch<MediaUserResponse>("/api/media-user", {
        method: "POST",
        body: JSON.stringify(params.body),
        signal: params.signal,
    });
}

export async function getMyMediaByType(params: {
    mediaTypeId: number;
    signal?: AbortSignal;
}): Promise<MediaUserItem[]> {
    const { mediaTypeId, signal } = params;

    return apiFetch(`/api/media-user?mediaTypeId=${encodeURIComponent(mediaTypeId)}`, {
        method: "GET",
        signal,
    });
}

export async function deleteMediaUser(params: {
    mediaId: number;
    signal?: AbortSignal;
}): Promise<void> {
    const { mediaId, signal } = params;

    await apiFetch<void>(`/api/media-user/${encodeURIComponent(mediaId)}`, {
        method: "DELETE",
        signal,
    });
}

export async function updateMediaUser(params: {
    mediaId: number;
    body: MediaUserUpdateRequest;
    signal?: AbortSignal;
}): Promise<MediaUserResponse> {
    const { mediaId, body, signal } = params;

    return apiFetch<MediaUserResponse>(`/api/media-user/${encodeURIComponent(mediaId)}`, {
        method: "PUT",
        body: JSON.stringify(body),
        signal,
    });
}

/**
 * DETAILS (drawer)
 */
export async function getMediaUserDetails(params: {
    mediaId: number;
    signal?: AbortSignal;
}): Promise<MediaUserDetailsResponse> {
    const { mediaId, signal } = params;

    return apiFetch<MediaUserDetailsResponse>(`/api/media-user/${encodeURIComponent(mediaId)}`, {
        method: "GET",
        signal,
    });
}

/**
 * HISTORY
 */
export async function addMediaUserHistory(params: {
    mediaId: number;
    body: MediaUserHistoryRequest;
    signal?: AbortSignal;
}): Promise<MediaUserHistoryItem> {
    const { mediaId, body, signal } = params;

    return apiFetch<MediaUserHistoryItem>(`/api/media-user/${encodeURIComponent(mediaId)}/history`, {
        method: "POST",
        body: JSON.stringify(body),
        signal,
    });
}

export async function updateMediaUserHistory(params: {
    mediaId: number;
    historyId: number;
    body: MediaUserHistoryRequest;
    signal?: AbortSignal;
}): Promise<MediaUserHistoryItem> {
    const { mediaId, historyId, body, signal } = params;

    return apiFetch<MediaUserHistoryItem>(
        `/api/media-user/${encodeURIComponent(mediaId)}/history/${encodeURIComponent(historyId)}`,
        {
            method: "PUT",
            body: JSON.stringify(body),
            signal,
        }
    );
}

export async function deleteMediaUserHistory(params: {
    mediaId: number;
    historyId: number;
    signal?: AbortSignal;
}): Promise<void> {
    const { mediaId, historyId, signal } = params;

    await apiFetch<void>(
        `/api/media-user/${encodeURIComponent(mediaId)}/history/${encodeURIComponent(historyId)}`,
        {
            method: "DELETE",
            signal,
        }
    );
}
