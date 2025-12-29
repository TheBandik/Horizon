import { getToken } from './token.ts';

export function isAuthenticated(): boolean {
    return !!getToken();
}