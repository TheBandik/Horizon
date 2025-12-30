import type { EventDatePayload, PartialDateValue } from "../types";

export function pad2(v: string) {
    return v.padStart(2, "0").slice(0, 2);
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
