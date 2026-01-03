import { useCallback, useEffect, useMemo, useState } from "react";
import { getMyMediaByType, type MediaUserItem } from "../../../api/mediaUser";
import type { MediaUserTableItem } from "../components/MediaUserTable";

function mapToTableItem(x: MediaUserItem): MediaUserTableItem {
    return {
        id: x.id,
        media: {
            id: x.media.id,
            title: x.media.title ?? null,
            originalTitle: x.media.originalTitle ?? null,
            releaseDate: x.media.releaseDate ?? null,
            poster: (x.media as any).poster ?? null,
        },
        status: {
            id: x.status.id,
            name: x.status.name,
        },
        rating: x.rating ?? null,

        lastEventDate: (x as any).lastEventDate ?? null,
    };
}

export function useMediaUserTable(active: string) {
    const [itemsByType, setItemsByType] = useState<Record<number, MediaUserItem[]>>({});
    const [rawItems, setRawItems] = useState<MediaUserItem[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [tableError, setTableError] = useState<string | null>(null);

    const tableItems = useMemo(() => rawItems.map(mapToTableItem), [rawItems]);

    const loadByType = useCallback(async (mediaTypeId: number, signal?: AbortSignal) => {
        setTableLoading(true);
        setTableError(null);

        try {
            const data = await getMyMediaByType({ mediaTypeId, signal });

            setItemsByType((prev) => ({ ...prev, [mediaTypeId]: data }));
            setRawItems(data);
        } catch (e) {
            if (e instanceof DOMException && e.name === "AbortError") return;

            const message = e instanceof Error ? e.message : "Не удалось загрузить данные";
            setTableError(message);
            setRawItems([]);
        } finally {
            setTableLoading(false);
        }
    }, []);

    const refetch = useCallback(
        async (opts?: { skipCache?: boolean }) => {
            if (!active) return;

            const mediaTypeId = Number(active);
            if (Number.isNaN(mediaTypeId)) return;

            if (opts?.skipCache) {
                setItemsByType((prev) => {
                    const next = { ...prev };
                    delete next[mediaTypeId];
                    return next;
                });
            }

            await loadByType(mediaTypeId);
        },
        [active, loadByType],
    );

    const invalidateActive = useCallback(() => {
        const mediaTypeId = Number(active);
        if (Number.isNaN(mediaTypeId)) return;

        setItemsByType((prev) => {
            const next = { ...prev };
            delete next[mediaTypeId];
            return next;
        });
    }, [active]);

    useEffect(() => {
        if (!active) return;

        const mediaTypeId = Number(active);
        if (Number.isNaN(mediaTypeId)) return;

        const cached = itemsByType[mediaTypeId];
        if (cached) {
            setRawItems(cached);
            return;
        }

        const controller = new AbortController();
        loadByType(mediaTypeId, controller.signal);

        return () => controller.abort();
    }, [active, itemsByType, loadByType]);

    return {
        tableItems,
        tableLoading,
        tableError,

        itemsByType,
        setItemsByType,

        refetch,
        invalidateActive,
    };
}
