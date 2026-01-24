import type { EventDatePayload, PartialDateValue } from "../types";
import type {DatePrecision} from "../../../api/mediaUser.ts";

export function pad2(v: string) {
    return v.padStart(2, "0").slice(0, 2);
}

export function formatByPrecision(
    iso: string | null | undefined,
    p: DatePrecision | null | undefined
): string {
    if (!iso) return "—";
    const s = iso.trim();

    if (p === "YEAR") return s.slice(0, 4);
    if (p === "MONTH") return s.length >= 7 ? s.slice(0, 7) : s.slice(0, 4);
    return s.length >= 10 ? s.slice(0, 10) : s;
}

export function buildEventDatePayload(date: PartialDateValue): EventDatePayload {
    const y = date.year.trim();
    const m = date.month.trim();
    const d = date.day.trim();

    if (!y) return { eventDate: null, precision: null };

    if (y && m && d) return { eventDate: `${y}-${pad2(m)}-${pad2(d)}`, precision: "DAY" };

    if (y && m) return { eventDate: `${y}-${pad2(m)}-01`, precision: "MONTH" };

    return { eventDate: `${y}-01-01`, precision: "YEAR" };
}
