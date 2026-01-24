import {ActionIcon, Table} from "@mantine/core";
import {IconEye, IconPencil, IconTrash} from "@tabler/icons-react";
import React, {useMemo, useState} from "react";
import type {DatePrecision} from "../../../api/mediaUser.ts";

export type MediaUserTableItem = {
    id: number;

    media: {
        id: number;
        title: string | null;
        originalTitle: string | null;
        releaseDate: string | null;
        poster: string | null;
        mediaType: {
            id: number;
            name: string;
        } | null;
    };

    status: {
        id: number;
        name: string;
    };

    rating: number | null;
    lastEventDate: string | null;
    lastEventPrecision: DatePrecision | null;
};

type SortKey = "TITLE" | "YEAR" | "STATUS" | "USER_DATE" | "RATING";
type SortDir = "ASC" | "DESC";

type MediaUserTableProps = {
    items: MediaUserTableItem[];
    maxHeight?: string | number;
    minWidth?: string | number;

    onRowClick?: (item: MediaUserTableItem) => void;
    onEditClick?: (item: MediaUserTableItem) => void;
    onDetailsClick?: (item: MediaUserTableItem) => void;

    onDeleteClick?: (item: MediaUserTableItem) => void;
};

function normalizeString(v: string | null | undefined): string {
    return (v ?? "").trim().toLowerCase();
}

function yearKey(releaseDate: string | null | undefined): number {
    if (!releaseDate) return 0;
    const y = Number(releaseDate.slice(0, 4));
    return Number.isFinite(y) ? y : 0;
}

function compareNullableNumber(a: number | null, b: number | null): number {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    return a - b;
}

function dateKey(iso: string | null | undefined, p: DatePrecision | null | undefined): number {
    if (!iso) return 0;
    const s = iso.trim();
    const y = s.slice(0, 4);
    if (y.length !== 4 || Number.isNaN(Number(y))) return 0;

    const m = p === "YEAR" ? "01" : (s.length >= 7 ? s.slice(5, 7) : "01");
    const d = p === "DAY" ? (s.length >= 10 ? s.slice(8, 10) : "01") : "01";

    const yy = Number(y), mm = Number(m), dd = Number(d);
    if ([yy, mm, dd].some(Number.isNaN)) return 0;

    return yy * 10000 + mm * 100 + dd;
}

function formatByPrecision(iso: string | null | undefined, p: DatePrecision | null | undefined): string {
    if (!iso) return "—";
    const s = iso.trim();

    if (p === "YEAR") return s.slice(0, 4);
    if (p === "MONTH") return s.length >= 7 ? s.slice(0, 7) : s.slice(0, 4);
    return s.length >= 10 ? s.slice(0, 10) : s;
}

export function MediaUserTable({
                                   items,
                                   maxHeight = "68vh",
                                   minWidth = "75vw",
                                   onRowClick,
                                   onEditClick,
                                   onDetailsClick,
                                   onDeleteClick,
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
                    res = normalizeString(a.media.title).localeCompare(
                        normalizeString(b.media.title)
                    );
                    break;
                case "YEAR":
                    res = yearKey(a.media.releaseDate) - yearKey(b.media.releaseDate);
                    break;
                case "STATUS":
                    res = normalizeString(a.status.name).localeCompare(
                        normalizeString(b.status.name)
                    );
                    break;
                case "USER_DATE":
                    res = dateKey(a.lastEventDate, a.lastEventPrecision) -
                        dateKey(b.lastEventDate, b.lastEventPrecision);
                    break;
                case "RATING":
                    res = compareNullableNumber(a.rating, b.rating);
                    break;
            }

            if (res !== 0) return res * dir;
            return a.id - b.id;
        });

        return arr;
    }, [items, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDir("ASC");
        } else {
            setSortDir((d) => (d === "ASC" ? "DESC" : "ASC"));
        }
    };

    const sortMark = (key: SortKey) =>
        sortKey === key ? (sortDir === "ASC" ? " ↑" : " ↓") : null;

    const showActions = Boolean(onEditClick || onDetailsClick || onDeleteClick);

    const tdEllipsis: React.CSSProperties = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    };

    return (
        <Table.ScrollContainer
            maxHeight={maxHeight}
            minWidth={minWidth}
            style={{paddingInline: "var(--mantine-spacing-lg)"}} // ← ВАЖНО
        >
            <Table
                striped
                highlightOnHover
                withRowBorders={false}
                horizontalSpacing="lg"
                style={{tableLayout: "fixed", width: "100%"}}
            >
                <colgroup>
                    <col style={{width: "42%"}}/>
                    <col style={{width: 80}}/>
                    <col style={{width: "18%"}}/>
                    <col style={{width: 120}}/>
                    <col style={{width: 90}}/>
                    {showActions && <col style={{width: 128}}/>}
                </colgroup>

                <Table.Thead>
                    <Table.Tr>
                        <Table.Th onClick={() => toggleSort("TITLE")} style={{cursor: "pointer"}}>
                            Title{sortMark("TITLE")}
                        </Table.Th>
                        <Table.Th onClick={() => toggleSort("YEAR")} style={{cursor: "pointer"}}>
                            Year{sortMark("YEAR")}
                        </Table.Th>
                        <Table.Th onClick={() => toggleSort("STATUS")} style={{cursor: "pointer"}}>
                            Status{sortMark("STATUS")}
                        </Table.Th>
                        <Table.Th onClick={() => toggleSort("USER_DATE")} style={{cursor: "pointer"}}>
                            User Date{sortMark("USER_DATE")}
                        </Table.Th>
                        <Table.Th onClick={() => toggleSort("RATING")} style={{cursor: "pointer"}}>
                            Rating{sortMark("RATING")}
                        </Table.Th>
                        {showActions && <Table.Th/>}
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {sortedItems.map((x) => {
                        const title = x.media.title ?? x.media.originalTitle ?? "—";

                        return (
                            <Table.Tr
                                key={x.id}
                                style={onRowClick ? {cursor: "pointer"} : undefined}
                                onClick={() => onRowClick?.(x)}
                            >
                                <Table.Td style={tdEllipsis} title={title}>{title}</Table.Td>
                                <Table.Td style={tdEllipsis}>
                                    {x.media.releaseDate?.slice(0, 4) ?? "—"}
                                </Table.Td>
                                <Table.Td style={tdEllipsis} title={x.status.name}>
                                    {x.status.name}
                                </Table.Td>
                                <Table.Td style={tdEllipsis}>
                                    {formatByPrecision(x.lastEventDate, x.lastEventPrecision)}
                                </Table.Td>
                                <Table.Td style={tdEllipsis}>{x.rating ?? "—"}</Table.Td>

                                {showActions && (
                                    <Table.Td style={{textAlign: "right"}}>
                                        {onDetailsClick && (
                                            <ActionIcon
                                                variant="subtle"
                                                radius="xl"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDetailsClick(x);
                                                }}
                                            >
                                                <IconEye size={18} stroke={1.5}/>
                                            </ActionIcon>
                                        )}

                                        {onEditClick && (
                                            <ActionIcon
                                                variant="subtle"
                                                radius="xl"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditClick(x);
                                                }}
                                            >
                                                <IconPencil size={18} stroke={1.5}/>
                                            </ActionIcon>
                                        )}

                                        {onDeleteClick && (
                                            <ActionIcon
                                                variant="subtle"
                                                radius="xl"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteClick(x);
                                                }}
                                            >
                                                <IconTrash size={18} stroke={1.5}/>
                                            </ActionIcon>
                                        )}
                                    </Table.Td>
                                )}
                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
