import { useEffect, useState } from "react";
import { getMyMediaByType, type MediaUserItem } from "../../../api/mediaUser";

export function useMediaUserTable(active: string) {
    const [itemsByType, setItemsByType] = useState<Record<number, MediaUserItem[]>>({});
    const [tableItems, setTableItems] = useState<MediaUserItem[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [tableError, setTableError] = useState<string | null>(null);

    useEffect(() => {
        if (!active) return;

        const mediaTypeId = Number(active);
        if (Number.isNaN(mediaTypeId)) return;

        const cached = itemsByType[mediaTypeId];
        if (cached) {
            setTableItems(cached);
            return;
        }

        const controller = new AbortController();

        (async () => {
            try {
                setTableLoading(true);
                setTableError(null);

                const data = await getMyMediaByType({ mediaTypeId, signal: controller.signal });

                setItemsByType((prev) => ({ ...prev, [mediaTypeId]: data }));
                setTableItems(data);
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;

                const message = e instanceof Error ? e.message : "Не удалось загрузить данные";
                setTableError(message);
                setTableItems([]);
            } finally {
                setTableLoading(false);
            }
        })();

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    return { tableItems, tableLoading, tableError, setItemsByType, itemsByType, setTableItems };
}
