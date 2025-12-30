export function applySavedOrder<T extends { id: string }>(defaults: T[], savedIds: string[] | null): T[] {
    if (!savedIds || savedIds.length === 0) return defaults;

    const byId = new Map(defaults.map((x) => [x.id, x] as const));
    const ordered: T[] = [];

    for (const id of savedIds) {
        const item = byId.get(id);
        if (item) ordered.push(item);
        byId.delete(id);
    }
    for (const item of byId.values()) ordered.push(item);

    return ordered;
}
