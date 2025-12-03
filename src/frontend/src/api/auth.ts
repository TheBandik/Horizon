export type RegisterDto = {
    username: string;
    email: string;
    password: string;
};

export type ApiError = {
    code: string;
    message: string;
    status: number;
    path: string;
    timestamp: string;
    details: Record<string, string>;
};

export async function registerUser(dto: RegisterDto): Promise<void> {
    const response = await fetch('http://127.0.0.1:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        let data: ApiError | null = null;

        try {
            data = await response.json();
        } catch {
            // тело не JSON — тогда просто кинем обычную ошибку
        }

        if (data && data.code) {
            // вот сюда попадёт твой EMAIL_ALREADY_EXISTS / USERNAME_ALREADY_EXISTS
            throw data;
        }

        throw new Error('Registration failed');
    }

    // если всё ок — просто выходим
}
