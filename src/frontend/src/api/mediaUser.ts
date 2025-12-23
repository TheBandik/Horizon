export type DatePrecision = "DAY" | "MONTH" | "YEAR";

export type MediaUserCreateRequest = {
    mediaId: number;
    userId: number;
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

export async function createMediaUser(params: {
    body: MediaUserCreateRequest;
    signal?: AbortSignal;
}): Promise<MediaUserResponse> {
    const url = new URL(`${API_URL}/api/media-user`);

    const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.body),
        signal: params.signal,
    });

    if (!response.ok) {
        const err = await parseApiError(response);
        if (err) throw err;
        throw new Error("Create media user failed");
    }

    return response.json();
}
