import {apiFetch} from '../http.ts';

export type RegisterDto = {
    username: string;
    email: string;
    password: string;
};

export type LoginDto = {
    login: string;
    password: string;
    captchaToken: string;
};

export type LoginResponse = {
    accessToken: string;
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

export async function registerUser(dto: RegisterDto): Promise<void> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        let data: ApiError | null = null;

        try {
            data = await response.json();
        } catch { /* empty */
        }

        if (data && data.code) {
            throw data;
        }
        throw new Error('Registration failed');
    }
}

export async function loginUser(dto: LoginDto): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
}
