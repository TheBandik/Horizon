export type StatusResponse = {
    id: number;
    code: string;
    name: string;
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

export async function getStatuses(params?: { signal?: AbortSignal }): Promise<StatusResponse[]> {
    const url = new URL(`${API_URL}/api/status`);

    const response = await fetch(url.toString(), { signal: params?.signal });

    if (!response.ok) {
        const err = await parseApiError(response);
        if (err) throw err;
        throw new Error("Get statuses failed");
    }

    return response.json();
}
