export interface AuthResponse {
    success: boolean;
    message?: string;
    token?: string;
}

const host = "http://127.0.0.1:8000/";

export const registerUser = async (login: string, name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(host + "register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, login, email, password }),
    });

    return response.json();
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(host + "login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    return response.json();
};
