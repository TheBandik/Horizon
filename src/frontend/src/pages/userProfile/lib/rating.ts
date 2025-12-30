export function normalizeRating(rating: number | null): number | null {
    if (rating == null) return null;
    const v = Math.trunc(rating);
    if (Number.isNaN(v)) return null;
    return Math.max(1, Math.min(10, v));
}
