import { apiFetch } from "./http";

export type UserProfile = {
    id: number;
    username: string;
};

export async function getCurrentUser(params?: { signal?: AbortSignal }): Promise<UserProfile> {
    return apiFetch<UserProfile>("/user/me", { method: "GET", signal: params?.signal });
}

export async function getUserByUsername(params: {
    username: string;
    signal?: AbortSignal;
}): Promise<UserProfile> {
    return apiFetch<UserProfile>(`/user/by-username/${encodeURIComponent(params.username)}`, {
        method: "GET",
        signal: params.signal,
    });
}
