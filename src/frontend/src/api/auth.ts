export type RegisterDto = {
    username: string;
    email: string;
    password: string;
};

export type LoginDto = {
    login: string;
    password: string;
};

export type LoginResponse = {
    id: number;
    username: string;
    email: string;
};

export type ApiError = {
    code: string;
    message: string;
    status: number;
    path: string;
    timestamp: string;
    details: Record<string, string>;
};

const API_URL = 'http://127.0.0.1:8080'

export async function registerUser(dto: RegisterDto): Promise<void> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        let data: ApiError | null = null;

        try {
            data = await response.json();
        } catch { /* empty */ }

        if (data && data.code) {
            throw data;
        }
        throw new Error('Registration failed');
    }
}

export async function loginUser(dto: LoginDto): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        let data: ApiError | null = null;
        try {
            data = await response.json();
        } catch { /* empty */ }

        if (data && data.code) {
            throw data;
        }

        throw new Error('Login failed');
    }

    return response.json();
}
