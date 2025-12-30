import {
    IconBat,
    IconBook2,
    IconDeviceGamepad2,
    IconDeviceTv,
    IconMasksTheater,
    IconMovie,
} from "@tabler/icons-react";
import type { StatusScope } from "../../../api/statuses";

export function iconByMediaTypeName(name: string) {
    const key = name.trim().toLowerCase();
    switch (key) {
        case "game":
            return IconDeviceGamepad2;
        case "movie":
            return IconMovie;
        case "series":
            return IconDeviceTv;
        case "book":
            return IconBook2;
        case "comics":
            return IconBat;
        case "theatre":
            return IconMasksTheater;
        default:
            return IconDeviceTv;
    }
}

export function resolveScopeByMediaTypeName(name?: string | null): StatusScope | null {
    const v = name?.trim().toLowerCase();
    if (!v) return null;

    if (v === "game") return "GAME";
    if (v === "movie" || v === "series" || v === "theatre") return "MOVIE";
    if (v === "book" || v === "comics") return "BOOK";

    return null;
}
