import {apiFetch} from "./http.ts";

export type StatusResponse = {
    id: number;
    code: string;
    name: string;
};

export async function getStatuses(params?: { signal?: AbortSignal }): Promise<StatusResponse[]> {
    return apiFetch<StatusResponse[]>('/api/status', {signal: params?.signal});
}
