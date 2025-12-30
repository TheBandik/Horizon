import { useEffect, useState } from "react";
import { getStatuses, type StatusDto } from "../../../api/statuses";

export function useStatuses() {
    const [statuses, setStatuses] = useState<StatusDto[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const data = await getStatuses({ signal: controller.signal });
                setStatuses(data);
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                setStatuses([]);
            }
        })();

        return () => controller.abort();
    }, []);

    return { statuses };
}
