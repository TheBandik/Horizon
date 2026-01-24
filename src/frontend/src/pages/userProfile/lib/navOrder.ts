import type { MediaNavItem } from "../types.ts";

export type NavItem = { id: string; disabled?: boolean };

export function applyNavOrder<T extends NavItem>(items: T[], order: string[]): T[] {
    const byId = new Map(items.map((i) => [i.id, i] as const));

    const ordered = order
        .map((id) => byId.get(id))
        .filter(Boolean) as T[];

    const rest = items.filter((i) => !order.includes(i.id));

    return [...ordered, ...rest];
}

export function extractMovableOrder(items: MediaNavItem[]): string[] {
    const firstDisabledIndex = items.findIndex((i) => i.disabled);
    const boundary = firstDisabledIndex === -1 ? items.length : firstDisabledIndex;
    return items.slice(0, boundary).map((i) => i.id);
}

export function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}
