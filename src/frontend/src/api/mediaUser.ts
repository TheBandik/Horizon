import {apiFetch} from './http';

export type DatePrecision = "DAY" | "MONTH" | "YEAR";

export type MediaUserCreateRequest = {
    mediaId: number;
    statusId: number;
    rating: number | null;
    eventDate: string | null;
    precision: DatePrecision | null;
};

export type MediaUserResponse = {
    id: number;
    mediaId: number;
    userId: number;
    statusId: number;
    rating: number | null;
    eventDate: string | null;
    precision: DatePrecision | null;
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

export async function createMediaUser(params: {
    body: MediaUserCreateRequest;
    signal?: AbortSignal;
}): Promise<MediaUserResponse> {

    return apiFetch<MediaUserResponse>('/api/media-user', {
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

    return apiFetch(
        `/api/media-user?mediaTypeId=${encodeURIComponent(mediaTypeId)}`,
        {
            method: "GET",
            signal,
        }
    );
}
