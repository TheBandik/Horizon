import { apiFetch } from "./http";

export type UserPreferences = {
    nav?: {
        mediaTypesOrder?: string[];
    };
};

export async function getUserPreferences(params?: { signal?: AbortSignal }): Promise<UserPreferences> {
    return apiFetch<UserPreferences>("/user/preferences", {
        method: "GET",
        signal: params?.signal,
    });
}

export async function patchUserPreferences(params: {
    patch: Partial<UserPreferences>;
    signal?: AbortSignal;
}): Promise<UserPreferences> {
    return apiFetch<UserPreferences>("/user/preferences", {
        method: "PATCH",
        body: JSON.stringify(params.patch),
        signal: params.signal,
    });
}
