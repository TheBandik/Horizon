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
