import { useEffect, useMemo, useState } from "react";
import { getMediaTypes, type MediaTypeDto } from "../../../api/mediaTypes";
import { iconByMediaTypeName } from "../lib/mediaType";
import { applySavedOrder } from "../lib/storage";
import type { MediaNavItem } from "../types";

export const NAV_ORDER_STORAGE_KEY = "horizon.nav.order.v1";

export function useMediaTypesNav() {
    const [active, setActive] = useState<string>("");
    const [mediaTypes, setMediaTypes] = useState<MediaNavItem[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const list: MediaTypeDto[] = await getMediaTypes({ signal: controller.signal });

                const defaults: MediaNavItem[] = list.map((mt) => ({
                    id: String(mt.id),
                    link: "#",
                    label: mt.name,
                    icon: iconByMediaTypeName(mt.name),
                    disabled: false,
                }));

                let ordered = defaults;
                try {
                    const raw = localStorage.getItem(NAV_ORDER_STORAGE_KEY);
                    const saved = raw ? (JSON.parse(raw) as string[]) : null;
                    ordered = applySavedOrder(defaults, saved);
                } catch {
                    // ignore
                }

                setMediaTypes(ordered);
                setActive((prev) => prev || (ordered[0]?.id ?? ""));
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                setMediaTypes([]);
            }
        })();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(NAV_ORDER_STORAGE_KEY, JSON.stringify(mediaTypes.map((x) => x.id)));
        } catch {
            // ignore
        }
    }, [mediaTypes]);

    const activeMediaTypeName = useMemo(() => {
        const nav = mediaTypes.find((x) => x.id === active);
        return nav?.label ?? null;
    }, [mediaTypes, active]);

    return { mediaTypes, setMediaTypes, active, setActive, activeMediaTypeName };
}
