import {useEffect, useState} from "react";
import {getCurrentUser} from "../api/user";

export function useCurrentUser() {
    const [user, setUser] = useState<{ id: number; username: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        getCurrentUser({signal: controller.signal})
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    return {user, loading};
}
