import { ActionIcon, Table } from "@mantine/core";
import { IconEye, IconPencil } from "@tabler/icons-react";
import { useMemo, useState } from "react";

export type MediaUserTableItem = {
    id: number;
    media: {
        id: number;
        title: string | null;
        originalTitle: string | null;
        releaseDate: string | null;
    };
    status: {
        id: number;
        name: string;
    };
    rating: number | null;

    eventDate?: string | null;
    precision?: "DAY" | "MONTH" | "YEAR" | null;
};

type SortKey = "TITLE" | "ORIGINAL_TITLE" | "RELEASE_DATE" | "STATUS" | "RATING";
type SortDir = "ASC" | "DESC";

type MediaUserTableProps = {
    items: MediaUserTableItem[];
    maxHeight?: string | number;
    minWidth?: string | number;

    onRowClick?: (item: MediaUserTableItem) => void;
    onEditClick?: (item: MediaUserTableItem) => void;
    onDetailsClick?: (item: MediaUserTableItem) => void;
};

function normalizeString(v: string | null | undefined): string {
    return (v ?? "").trim().toLowerCase();
}

function dateKey(iso: string | null | undefined): number {
    if (!iso) return 0;
    const s = iso.trim();
    const y = s.slice(0, 4);
    if (y.length !== 4 || Number.isNaN(Number(y))) return 0;

    const m = s.length >= 7 ? s.slice(5, 7) : "01";
    const d = s.length >= 10 ? s.slice(8, 10) : "01";

    const yy = Number(y);
    const mm = Number(m);
    const dd = Number(d);

    if (Number.isNaN(yy) || Number.isNaN(mm) || Number.isNaN(dd)) return 0;

    const m2 = Math.min(Math.max(mm, 1), 12);
    const d2 = Math.min(Math.max(dd, 1), 31);

    return yy * 10000 + m2 * 100 + d2;
}

function compareNullableNumber(a: number | null, b: number | null): number {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    return a - b;
}

export function MediaUserTable({
                                   items,
                                   maxHeight = "68vh",
                                   minWidth = "75vw",
                                   onRowClick,
                                   onEditClick,
                                   onDetailsClick,
                               }: MediaUserTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>("TITLE");
    const [sortDir, setSortDir] = useState<SortDir>("ASC");

    const sortedItems = useMemo(() => {
        const dir = sortDir === "ASC" ? 1 : -1;

        const arr = [...items];
        arr.sort((a, b) => {
            let res = 0;

            switch (sortKey) {
                case "TITLE":
                    res = normalizeString(a.media.title).localeCompare(normalizeString(b.media.title));
                    break;
                case "ORIGINAL_TITLE":
                    res = normalizeString(a.media.originalTitle).localeCompare(normalizeString(b.media.originalTitle));
                    break;
                case "RELEASE_DATE":
                    res = dateKey(a.media.releaseDate) - dateKey(b.media.releaseDate);
                    break;
                case "STATUS":
                    res = normalizeString(a.status.name).localeCompare(normalizeString(b.status.name));
                    break;
                case "RATING":
                    res = compareNullableNumber(a.rating, b.rating);
                    break;
            }

            if (res !== 0) return res * dir;
            return (a.id - b.id) * dir;
        });

        return arr;
    }, [items, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDir("ASC");
            return;
        }
        setSortDir((d) => (d === "ASC" ? "DESC" : "ASC"));
    };

    const sortMark = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortDir === "ASC" ? " ↑" : " ↓";
    };

    const showActions = Boolean(onEditClick || onDetailsClick);

    const rows = sortedItems.map((x) => (
        <Table.Tr
            key={x.id}
            style={onRowClick ? { cursor: "pointer" } : undefined}
            onClick={() => onRowClick?.(x)}
        >
            <Table.Td>{x.media.title ?? "—"}</Table.Td>
            <Table.Td>{x.media.originalTitle ?? "—"}</Table.Td>
            <Table.Td>{x.media.releaseDate ?? "—"}</Table.Td>
            <Table.Td>{"—"}</Table.Td>
            <Table.Td>{x.status.name}</Table.Td>
            <Table.Td>{x.rating ?? "—"}</Table.Td>

            {showActions && (
                <Table.Td style={{ width: 96, textAlign: "right" }}>
                    {onDetailsClick && (
                        <ActionIcon
                            variant="subtle"
                            radius="xl"
                            aria-label="Details"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDetailsClick(x);
                            }}
                        >
                            <IconEye size={18} stroke={1.5} />
                        </ActionIcon>
                    )}

                    {onEditClick && (
                        <ActionIcon
                            variant="subtle"
                            radius="xl"
                            aria-label="Edit"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEditClick(x);
                            }}
                        >
                            <IconPencil size={18} stroke={1.5} />
                        </ActionIcon>
                    )}
                </Table.Td>
            )}
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer maxHeight={maxHeight} minWidth={minWidth}>
            <Table striped highlightOnHover withRowBorders={false} horizontalSpacing="lg">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ cursor: "pointer" }} onClick={() => toggleSort("TITLE")}>
                            Title{sortMark("TITLE")}
                        </Table.Th>
                        <Table.Th style={{ cursor: "pointer" }} onClick={() => toggleSort("ORIGINAL_TITLE")}>
                            Original Title{sortMark("ORIGINAL_TITLE")}
                        </Table.Th>
                        <Table.Th style={{ cursor: "pointer" }} onClick={() => toggleSort("RELEASE_DATE")}>
                            Release Date{sortMark("RELEASE_DATE")}
                        </Table.Th>
                        <Table.Th>Franchise</Table.Th>
                        <Table.Th style={{ cursor: "pointer" }} onClick={() => toggleSort("STATUS")}>
                            User Status{sortMark("STATUS")}
                        </Table.Th>
                        <Table.Th style={{ cursor: "pointer" }} onClick={() => toggleSort("RATING")}>
                            Rating{sortMark("RATING")}
                        </Table.Th>

                        {showActions && <Table.Th style={{ width: 96 }} />}
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
