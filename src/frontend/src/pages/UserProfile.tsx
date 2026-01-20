import {IconCalendarPlus, IconLogout, IconPencil, IconPlus, IconTrash} from "@tabler/icons-react";
import {
    ActionIcon,
    Button,
    Combobox,
    Divider,
    Drawer,
    Flex,
    Group,
    Loader,
    Modal,
    SegmentedControl,
    Stack,
    Text,
    TextInput,
    useCombobox,
} from "@mantine/core";
import {modals} from "@mantine/modals";
import classes from "./styles/UserProfile.module.css";
import packageJson from "../../package.json";
import {LanguageSwitcher} from "../components/LanguageSwitcher.tsx";
import {ThemeToggle} from "../components/ThemeToggle.tsx";
import {useDebouncedValue, useDisclosure, useMediaQuery} from "@mantine/hooks";
import {useTranslation} from "react-i18next";
import {useCallback, useEffect, useMemo, useState} from "react";
import {type ExternalGameSearchItem, importRawgGame, type MediaResponse, searchMixedMedia,} from "../api/media.ts";
import {MediaEditModal} from "../components/MediaEditModal";
import {
    addMediaUserHistory,
    createMediaUser,
    type DatePrecision,
    deleteMediaUser,
    deleteMediaUserHistory,
    getMediaUserDetails,
    type MediaUserCreateRequest,
    type MediaUserDetailsResponse,
    type MediaUserHistoryItem,
    type MediaUserHistoryRequest,
    updateMediaUser,
    updateMediaUserHistory,
} from "../api/mediaUser.ts";
import {closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors,} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {logout} from "../api/auth/logout.ts";
import {useNavigate} from "react-router-dom";
import type {StatusDto} from "../api/statuses.ts";

import type {PartialDateValue} from "./userProfile/types";
import {buildEventDatePayload} from "./userProfile/lib/dates";
import {normalizeRating} from "./userProfile/lib/rating";
import {resolveScopeByMediaTypeName} from "./userProfile/lib/mediaType";
import {SortableNavLink} from "./userProfile/components/SortableNavLink";
import {useStatuses} from "./userProfile/hooks/useStatuses";
import {useMediaTypesNav} from "./userProfile/hooks/useMediaTypesNav";
import {useMediaUserTable} from "./userProfile/hooks/useMediaUserTable";
import {MediaUserTable, type MediaUserTableItem} from "./userProfile/components/MediaUserTable";


function precisionLabel(p: DatePrecision | null) {
    if (!p) return "—";
    if (p === "DAY") return "Day";
    if (p === "MONTH") return "Month";
    if (p === "YEAR") return "Year";
    return p;
}

function formatDateISO(d: string | null) {
    if (!d) return "—";
    return d.slice(0, 10);
}

type HistoryModalMode = "ADD" | "EDIT";

type HistoryModalState =
    | { opened: false }
    | {
    opened: true;
    mode: HistoryModalMode;
    mediaId: number;
    historyId: number | null;
    value: PartialDateValue;
    precision: DatePrecision | null;
};

export function UserProfile() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");

    const [query, setQuery] = useState("");
    const [debounced] = useDebouncedValue(query, 250);
    const [results, setResults] = useState<MediaResponse[]>([]);
    const [rawgResults, setRawgResults] = useState<ExternalGameSearchItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editMediaId, setEditMediaId] = useState<number | null>(null);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [modalOpened, {open: openModal, close: closeModal}] = useDisclosure(false);
    const [modalItem, setModalItem] = useState<MediaResponse | null>(null);
    const [rating, setRating] = useState<number | null>(null);

    const [createPartialDate, setCreatePartialDate] = useState<PartialDateValue>({
        day: "",
        month: "",
        year: "",
    });

    const [statusId, setStatusId] = useState<number | null>(null);

    const [detailsOpened, {open: openDetails, close: closeDetails}] = useDisclosure(false);
    const [detailsItem, setDetailsItem] = useState<MediaUserTableItem | null>(null);

    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);
    const [details, setDetails] = useState<MediaUserDetailsResponse | null>(null);

    const [historyModal, setHistoryModal] = useState<HistoryModalState>({opened: false});

    const {mediaTypes, setMediaTypes, active, setActive, activeMediaTypeName} = useMediaTypesNav();
    const {tableItems, refetch, invalidateActive} = useMediaUserTable(active);
    const {statuses} = useStatuses();

    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const statusName = useMemo(() => {
        if (!details?.statusId) return null;
        return statuses.find(s => s.id === details.statusId)?.name ?? null;
    }, [details?.statusId, statuses]);

    useEffect(() => {
        setStatusFilter("ALL");
    }, [active]);

    const activeScope = useMemo(() => resolveScopeByMediaTypeName(activeMediaTypeName), [activeMediaTypeName]);

    const availableStatuses = useMemo(() => {
        if (!activeScope) return statuses.filter((s) => s.scope === "ALL");
        return statuses.filter((s) => s.scope === "ALL" || s.scope === activeScope);
    }, [statuses, activeScope]);

    const segmentedData = useMemo(() => {
        return [
            {label: "All", value: "ALL"},
            ...availableStatuses.map((s: StatusDto) => ({
                label: s.name,
                value: String(s.id),
            })),
        ];
    }, [availableStatuses]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {distance: 6},
        })
    );

    const onDragEnd = (event: DragEndEvent) => {
        const {active: a, over} = event;
        if (!over) return;
        if (a.id === over.id) return;

        setMediaTypes((items) => {
            const oldIndex = items.findIndex((i) => i.id === a.id);
            const overIndex = items.findIndex((i) => i.id === over.id);
            if (oldIndex === -1 || overIndex === -1) return items;

            const firstDisabledIndex = items.findIndex((i) => i.disabled);
            const boundary = firstDisabledIndex === -1 ? items.length : firstDisabledIndex;

            if (boundary <= 0) return items;

            const overIsDisabled = items[overIndex]?.disabled;
            let newIndex = overIsDisabled ? boundary - 1 : overIndex;

            newIndex = Math.min(newIndex, boundary - 1);

            if (newIndex === oldIndex) return items;

            return arrayMove(items, oldIndex, newIndex);
        });
    };

    const rawgVisibleResults = useMemo(() => {
        return rawgResults.filter((x) => !x.alreadyImported);
    }, [rawgResults]);

    // CREATE from search
    const openItemModal = (item: MediaResponse) => {
        combobox.closeDropdown();

        setEditMediaId(null);
        setModalItem(item);

        setRating(null);
        setCreatePartialDate({day: "", month: "", year: ""});
        setStatusId(null);

        openModal();
    };

    const handlePickRawg = useCallback(
        async (externalId: string) => {
            const controller = new AbortController();

            try {
                setLoading(true);
                setError(null);

                const media = await importRawgGame({externalId, signal: controller.signal});

                setResults((prev) => {
                    if (prev.some((x) => x.id === media.id)) return prev;
                    return [media, ...prev];
                });

                setRawgResults((prev) =>
                    prev.map((x) => (x.externalId === externalId ? {...x, alreadyImported: true} : x))
                );

                openItemModal(media);
            } catch (e) {
                const message = e instanceof Error ? e.message : "Import failed";
                setError(message);
            } finally {
                setLoading(false);
            }
        },
        [openItemModal]
    );

    const loadDetails = useCallback(
        async (mediaId: number) => {
            try {
                setDetailsLoading(true);
                setDetailsError(null);

                const data = await getMediaUserDetails({mediaId});
                setDetails(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
                setDetailsError(msg);
                setDetails(null);
            } finally {
                setDetailsLoading(false);
            }
        },
        []
    );

    const openDetailsDrawer = useCallback(
        (x: MediaUserTableItem) => {
            setDetailsItem(x);
            openDetails();
            void loadDetails(x.media.id);
        },
        [openDetails, loadDetails]
    );

    // EDIT existing card from table
    const openEditFromTable = useCallback(
        (x: MediaUserTableItem) => {
            setEditMediaId(x.media.id);

            setModalItem(x.media as unknown as MediaResponse);
            setRating(x.rating ?? null);
            setStatusId(x.status?.id ?? null);

            openModal();
        },
        [openModal]
    );

    const handleDeleteFromTable = useCallback(
        (x: MediaUserTableItem) => {
            const title = x.media.title ?? x.media.originalTitle ?? "—";

            modals.openConfirmModal({
                title: "Удалить из списка?",
                children: <Text size="sm">{title}</Text>,
                labels: {confirm: "Удалить", cancel: "Отмена"},
                confirmProps: {color: "red", leftSection: <IconTrash size={16}/>},
                onConfirm: async () => {
                    try {
                        await deleteMediaUser({mediaId: x.media.id});

                        invalidateActive();
                        await refetch();

                        setDetailsItem((cur) => (cur?.id === x.id ? null : cur));
                        if (detailsItem?.id === x.id) closeDetails();
                    } catch (e) {
                        const message = e instanceof Error ? e.message : "Неизвестная ошибка";
                        alert(message);
                    }
                },
            });
        },
        [invalidateActive, refetch, detailsItem, closeDetails]
    );

    const submittingDisabled = useMemo(() => {
        if (!modalItem) return true;
        return !statusId;
    }, [modalItem, statusId]);

    const resetSearch = useCallback(() => {
        setQuery("");
        setResults([]);
        setRawgResults([]);
        setError(null);
        setLoading(false);

        combobox.closeDropdown();
        combobox.resetSelectedOption();
    }, [combobox]);

    const handleCloseModal = useCallback(() => {
        closeModal();
        setEditMediaId(null);
        resetSearch();
    }, [closeModal, resetSearch]);

    const handleSubmit = async () => {
        if (!modalItem) return;

        if (!statusId) {
            alert("Выбери статус");
            return;
        }

        try {
            if (editMediaId != null) {
                // EDIT: only status + rating
                await updateMediaUser({
                    mediaId: editMediaId,
                    body: {statusId: Number(statusId), rating: normalizeRating(rating)},
                });
            } else {
                // CREATE: can send optional date
                const {eventDate, precision} = buildEventDatePayload(createPartialDate);

                const body: MediaUserCreateRequest = {
                    mediaId: Number(modalItem.id),
                    statusId: Number(statusId),
                    rating: normalizeRating(rating),
                    eventDate,
                    precision,
                };

                await createMediaUser({body});
            }

            invalidateActive();
            await refetch();

            if (detailsOpened && detailsItem) {
                await loadDetails(detailsItem.media.id);
            }

            handleCloseModal();
        } catch (e) {
            const message = e instanceof Error ? e.message : "Неизвестная ошибка";
            alert(message);
        }
    };

    useEffect(() => {
        const q = debounced.trim();

        if (q.length < 1) {
            setResults([]);
            setError(null);
            combobox.closeDropdown();
            return;
        }

        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await searchMixedMedia({
                    q,
                    mediaTypeId: active,
                    signal: controller.signal,
                });

                setResults(data.local);
                setRawgResults(data.rawg);

                if (data.local.length > 0 || data.rawg.length > 0) combobox.openDropdown();
                else combobox.closeDropdown();

            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;

                const message = e instanceof Error ? e.message : "Search failed";

                setError(message);
                setResults([]);
                setRawgResults([]);
                combobox.closeDropdown();
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced, active]);

    const filteredTableItems = useMemo(() => {
        if (statusFilter === "ALL") return tableItems;
        const id = Number(statusFilter);
        if (Number.isNaN(id)) return tableItems;
        return tableItems.filter((x) => x.status.id === id);
    }, [tableItems, statusFilter]);

    const onStatusIdChange = useCallback((v: number | null) => {
        setStatusId(v);
    }, []);

    const closeDetailsSafe = useCallback(() => {
        closeDetails();
        setDetails(null);
        setDetailsError(null);
        setDetailsLoading(false);
        setDetailsItem(null);
    }, [closeDetails]);

    const openAddHistory = useCallback(() => {
        if (!detailsItem) return;

        setHistoryModal({
            opened: true,
            mode: "ADD",
            mediaId: detailsItem.media.id,
            historyId: null,
            value: {day: "", month: "", year: ""},
            precision: null,
        });
    }, [detailsItem]);

    const openEditHistory = useCallback((h: MediaUserHistoryItem) => {
        if (!detailsItem) return;

        const iso = h.eventDate ? h.eventDate.slice(0, 10) : "";
        const [y, m, d] = iso ? iso.split("-") : ["", "", ""];

        const p = h.precision ?? null;

        setHistoryModal({
            opened: true,
            mode: "EDIT",
            mediaId: detailsItem.media.id,
            historyId: h.id,
            value: {
                year: y ?? "",
                month: p === "DAY" || p === "MONTH" ? (m ?? "") : "",
                day: p === "DAY" ? (d ?? "") : "",
            },
            precision: p,
        });
    }, [detailsItem]);


    const closeHistoryModal = useCallback(() => {
        setHistoryModal({opened: false});
    }, []);

    const submitHistory = useCallback(async () => {
        if (!historyModal.opened) return;

        const {eventDate, precision} = buildEventDatePayload(historyModal.value);

        const body: MediaUserHistoryRequest = {
            eventDate,
            precision,
        };

        try {
            if (historyModal.mode === "ADD") {
                await addMediaUserHistory({
                    mediaId: historyModal.mediaId,
                    body,
                });
            } else {
                if (!historyModal.historyId) return;
                await updateMediaUserHistory({
                    mediaId: historyModal.mediaId,
                    historyId: historyModal.historyId,
                    body,
                });
            }

            closeHistoryModal();

            invalidateActive();
            await refetch();
            if (detailsItem) await loadDetails(detailsItem.media.id);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
            alert(msg);
        }
    }, [historyModal, invalidateActive, refetch, detailsItem, loadDetails, closeHistoryModal]);

    const confirmDeleteHistory = useCallback(
        (h: MediaUserHistoryItem) => {
            if (!detailsItem) return;

            modals.openConfirmModal({
                title: "Удалить дату?",
                children: (
                    <Stack gap={6}>
                        <Text size="sm">Дата: {h.eventDate ? formatDateISO(h.eventDate) : "—"}</Text>
                        <Text size="sm" c="dimmed">
                            Точность: {precisionLabel((h.precision as DatePrecision) ?? null)}
                        </Text>
                    </Stack>
                ),
                labels: {confirm: "Удалить", cancel: "Отмена"},
                confirmProps: {color: "red", leftSection: <IconTrash size={16}/>},
                onConfirm: async () => {
                    try {
                        await deleteMediaUserHistory({
                            mediaId: detailsItem.media.id,
                            historyId: h.id,
                        });

                        invalidateActive();
                        await refetch();
                        await loadDetails(detailsItem.media.id);
                    } catch (e) {
                        const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
                        alert(msg);
                    }
                },
            });
        },
        [detailsItem, invalidateActive, refetch, loadDetails]
    );

    return (
        <>
            <Modal
                opened={historyModal.opened}
                onClose={closeHistoryModal}
                centered
                radius="lg"
                padding="lg"
                zIndex={2000}
                title={historyModal.opened ? (historyModal.mode === "ADD" ? "Add date" : "Edit date") : "Date"}
            >
                {historyModal.opened && (
                    <Stack gap="md">
                        <Stack gap={8}>
                            <Text fw={700}>Date</Text>
                            <Group grow>
                                <TextInput
                                    label="Year"
                                    value={historyModal.value.year}
                                    onChange={(e) =>
                                        setHistoryModal((s) =>
                                            s.opened
                                                ? {
                                                    ...s,
                                                    value: {
                                                        ...s.value,
                                                        year: e.currentTarget.value.replace(/[^\d]/g, "").slice(0, 4)
                                                    }
                                                }
                                                : s
                                        )
                                    }
                                />
                                <TextInput
                                    label="Month"
                                    value={historyModal.value.month}
                                    onChange={(e) =>
                                        setHistoryModal((s) =>
                                            s.opened
                                                ? {
                                                    ...s,
                                                    value: {
                                                        ...s.value,
                                                        month: e.currentTarget.value.replace(/[^\d]/g, "").slice(0, 2)
                                                    }
                                                }
                                                : s
                                        )
                                    }
                                />
                                <TextInput
                                    label="Day"
                                    value={historyModal.value.day}
                                    onChange={(e) =>
                                        setHistoryModal((s) =>
                                            s.opened
                                                ? {
                                                    ...s,
                                                    value: {
                                                        ...s.value,
                                                        day: e.currentTarget.value.replace(/[^\d]/g, "").slice(0, 2)
                                                    }
                                                }
                                                : s
                                        )
                                    }
                                />
                            </Group>
                            <Text size="xs" c="dimmed">
                                Можно указать только год (YEAR), год+месяц (MONTH), или полный день (DAY).
                            </Text>
                        </Stack>

                        <Group justify="flex-end" gap="sm">
                            <Button variant="default" onClick={closeHistoryModal}>
                                Cancel
                            </Button>
                            <Button onClick={submitHistory}>OK</Button>
                        </Group>
                    </Stack>
                )}
            </Modal>

            <Drawer
                opened={detailsOpened}
                onClose={closeDetailsSafe}
                title={detailsItem?.media.title ?? detailsItem?.media.originalTitle ?? "Media"}
                position="right"
                size="md"
            >
                {!detailsItem ? null : (
                    <Stack gap="md">
                        <Group align="flex-start" wrap="nowrap">
                            <div
                                style={{
                                    width: 96,
                                    height: 144,
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    background: "var(--mantine-color-gray-2)",
                                    flex: "0 0 auto",
                                }}
                            >
                                {detailsItem.media.poster && (
                                    <img
                                        src={detailsItem.media.poster}
                                        alt={detailsItem.media.title ?? detailsItem.media.originalTitle ?? "poster"}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            display: "block",
                                        }}
                                        loading="lazy"
                                    />
                                )}
                            </div>

                            <Stack gap={6} style={{minWidth: 0, flex: 1}}>
                                <Text fw={700} size="lg" lineClamp={2}>
                                    {detailsItem.media.title ?? detailsItem.media.originalTitle ?? "—"}
                                </Text>

                                {detailsItem.media.originalTitle && detailsItem.media.originalTitle !== detailsItem.media.title && (
                                    <Text size="sm" c="dimmed" lineClamp={2}>
                                        {detailsItem.media.originalTitle}
                                    </Text>
                                )}

                                <Group gap="xs">
                                    <Text size="sm" c="dimmed">
                                        Year: {detailsItem.media.releaseDate?.slice(0, 4) ?? "—"}
                                    </Text>

                                    {detailsItem.media.mediaType && (
                                        <Text size="sm" c="dimmed">
                                            Type: {detailsItem.media.mediaType.name}
                                        </Text>
                                    )}
                                </Group>
                            </Stack>
                        </Group>

                        <Divider/>

                        {detailsLoading ? (
                            <Group justify="center">
                                <Loader size="sm"/>
                            </Group>
                        ) : detailsError ? (
                            <Text c="red">{detailsError}</Text>
                        ) : details ? (
                            <>
                                <Stack gap="xs">
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">
                                            Status
                                        </Text>
                                        <Text size="sm" fw={600}>
                                            {statusName ?? detailsItem.status.name}
                                        </Text>
                                    </Group>

                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">
                                            Rating
                                        </Text>
                                        <Text size="sm" fw={600}>
                                            {details.rating ?? "—"}
                                        </Text>
                                    </Group>

                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">
                                            Last Date
                                        </Text>
                                        <Text size="sm" fw={600}>
                                            {formatDateISO(details.lastEventDate ?? null)}
                                        </Text>
                                    </Group>
                                </Stack>

                                <Divider/>

                                <Group justify="space-between" align="center">
                                    <Text fw={700}>Dates</Text>

                                    <Button
                                        variant="light"
                                        leftSection={<IconCalendarPlus size={16}/>}
                                        onClick={openAddHistory}
                                    >
                                        Add
                                    </Button>
                                </Group>

                                {details.history.length === 0 ? (
                                    <Text size="sm" c="dimmed">
                                        No dates yet
                                    </Text>
                                ) : (
                                    <Stack gap="xs">
                                        {details.history.map((h) => (
                                            <Group key={h.id} justify="space-between" wrap="nowrap">
                                                <Stack gap={2} style={{minWidth: 0}}>
                                                    <Text fw={600} lineClamp={1}>
                                                        {h.eventDate ? formatDateISO(h.eventDate) : "—"}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        {precisionLabel((h.precision as DatePrecision) ?? null)}
                                                    </Text>
                                                </Stack>

                                                <Group gap="xs" wrap="nowrap">
                                                    <ActionIcon variant="light" radius="xl"
                                                                onClick={() => openEditHistory(h)} aria-label="Edit">
                                                        <IconPencil size={16}/>
                                                    </ActionIcon>

                                                    <ActionIcon
                                                        variant="light"
                                                        color="red"
                                                        radius="xl"
                                                        onClick={() => confirmDeleteHistory(h)}
                                                        aria-label="Delete"
                                                    >
                                                        <IconTrash size={16}/>
                                                    </ActionIcon>
                                                </Group>
                                            </Group>
                                        ))}
                                    </Stack>
                                )}

                                <Divider/>
                            </>
                        ) : null}

                        <Group justify="space-between">
                            <Button variant="default" onClick={closeDetailsSafe}>
                                Close
                            </Button>

                            <Group>
                                <Button
                                    onClick={() => {
                                        openEditFromTable(detailsItem);
                                        closeDetailsSafe();
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="light"
                                    onClick={() => {
                                        handleDeleteFromTable(detailsItem);
                                        closeDetailsSafe();
                                    }}
                                >
                                    Delete
                                </Button>
                            </Group>
                        </Group>
                    </Stack>
                )}
            </Drawer>

            <MediaEditModal
                opened={modalOpened}
                onClose={handleCloseModal}
                item={modalItem}
                rating={rating}
                onRatingChange={setRating}
                statusId={statusId}
                onStatusIdChange={onStatusIdChange}
                showDate={editMediaId == null}
                partialDate={createPartialDate}
                onPartialDateChange={setCreatePartialDate}
                onOk={handleSubmit}
                okDisabled={submittingDisabled}
            />


            <Flex>
                <nav className={classes.navbar}>
                    <div className={classes.navbarMain}>
                        <Group className={classes.header} justify="space-between">
                            <Text fw={700} size={"40px"} variant={"gradient"}>
                                Horizon
                            </Text>
                            <Text fw={700} size={"15px"}>
                                {packageJson.version}
                            </Text>
                        </Group>

                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                            <SortableContext items={mediaTypes.map((x) => x.id)} strategy={verticalListSortingStrategy}>
                                {mediaTypes.map((item) => (
                                    <SortableNavLink key={item.id} item={item} activeId={active}
                                                     onActivate={setActive}/>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>

                    <div className={classes.footer}>
                        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                            <span>TheBandik</span>
                        </a>

                        <a
                            href="#"
                            className={classes.link}
                            onClick={(event) => {
                                event.preventDefault();
                                logout();
                                navigate("/auth/login", {replace: true});
                            }}
                        >
                            <IconLogout className={classes.linkIcon} stroke={1.5}/>
                            <span>{t("logout")}</span>
                        </a>
                    </div>
                </nav>

                <Stack align={"center"} w={"100vw"}>
                    <Flex align={"center"} mt={"4%"}>
                        <Combobox
                            store={combobox}
                            withinPortal
                            onOptionSubmit={(value) => {
                                if (value.startsWith("rawg:")) {
                                    const externalId = value.slice("rawg:".length);
                                    void handlePickRawg(externalId);
                                    return;
                                }

                                const picked = results.find((x) => String(x.id) === value);
                                if (!picked) return;

                                setQuery(picked.title ?? picked.originalTitle ?? "");
                                combobox.closeDropdown();
                            }}
                        >
                            <Combobox.Target>
                                <TextInput
                                    size="md"
                                    placeholder="Search media"
                                    w="50vw"
                                    leftSection={<span style={{width: 18}}/>}
                                    rightSection={loading ? <Loader size="xs"/> : null}
                                    value={query}
                                    onChange={(e) => setQuery(e.currentTarget.value)}
                                    onFocus={() => {
                                        if (results.length > 0 || rawgVisibleResults.length > 0) combobox.openDropdown();
                                    }}
                                    onClick={() => {
                                        if (results.length > 0 || rawgVisibleResults.length > 0) combobox.openDropdown();
                                    }}
                                />
                            </Combobox.Target>

                            <Combobox.Dropdown>
                                <Combobox.Options>
                                    {error && <Combobox.Empty>{error}</Combobox.Empty>}

                                    {!error && results.length === 0 && rawgVisibleResults.length === 0 && !loading && (
                                        <Combobox.Empty>Nothing found</Combobox.Empty>
                                    )}

                                    {results.map((m) => (
                                        <Combobox.Option key={m.id} value={String(m.id)}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    gap: 12,
                                                }}
                                            >
                                                <div style={{display: "flex", flexDirection: "column", gap: 2}}>
                                                    <div style={{display: "flex", gap: 8, alignItems: "baseline"}}>
                                                        <span
                                                            style={{fontWeight: 600}}>{m.title ?? m.originalTitle ?? "Untitled"}</span>
                                                        <span style={{opacity: 0.7, fontSize: 12}}>
                              {m.releaseDate ? ` • ${m.releaseDate.slice(0, 4)}` : ""}
                            </span>
                                                    </div>

                                                    {m.originalTitle && m.title && m.originalTitle !== m.title && (
                                                        <span style={{
                                                            opacity: 0.7,
                                                            fontSize: 12
                                                        }}>{m.originalTitle}</span>
                                                    )}
                                                </div>

                                                <ActionIcon
                                                    variant="light"
                                                    radius="xl"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        openItemModal(m);
                                                    }}
                                                    aria-label="Open"
                                                >
                                                    +
                                                </ActionIcon>
                                            </div>
                                        </Combobox.Option>
                                    ))}
                                    {rawgVisibleResults.length > 0 && (
                                        <>
                                            <Divider my={6}/>

                                            <Text size="xs" c="dimmed" fw={600} px="xs" pb={4}>
                                                RAWG
                                            </Text>

                                            {rawgVisibleResults.map((g) => (
                                                <Combobox.Option key={g.externalId} value={`rawg:${g.externalId}`}>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            gap: 12,
                                                        }}
                                                    >
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: 2,
                                                            minWidth: 0
                                                        }}>
                                                            <div style={{
                                                                display: "flex",
                                                                gap: 8,
                                                                alignItems: "baseline"
                                                            }}>
                            <span style={{
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {g.title}
                            </span>
                                                                <span style={{opacity: 0.7, fontSize: 12}}>
                                {g.released ? ` • ${g.released.slice(0, 4)}` : ""}
                            </span>
                                                            </div>

                                                            <span style={{opacity: 0.7, fontSize: 12}}>
                            {g.alreadyImported ? "Imported" : "Import"}
                        </span>
                                                        </div>

                                                        <ActionIcon
                                                            variant="light"
                                                            radius="xl"
                                                            onMouseDown={(e) => e.preventDefault()}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                void handlePickRawg(g.externalId);
                                                            }}
                                                            aria-label={g.alreadyImported ? "Open" : "Import"}
                                                        >
                                                            +
                                                        </ActionIcon>
                                                    </div>
                                                </Combobox.Option>
                                            ))}
                                        </>
                                    )}
                                </Combobox.Options>
                            </Combobox.Dropdown>
                        </Combobox>

                        <ActionIcon size={40} radius="xl" variant="filled" ml={"xs"}
                                    onClick={() => navigate("/create")}>
                            <IconPlus size={18} stroke={1.5}/>
                        </ActionIcon>
                    </Flex>

                    <SegmentedControl data={segmentedData} value={statusFilter} onChange={setStatusFilter}
                                      classNames={classes}/>

                    <MediaUserTable
                        items={filteredTableItems}
                        onRowClick={openDetailsDrawer}
                        onDetailsClick={openDetailsDrawer}
                        onEditClick={openEditFromTable}
                        onDeleteClick={handleDeleteFromTable}
                    />
                </Stack>

                {!isMobile && (
                    <div style={{position: "absolute", right: 20, bottom: 15}}>
                        <Group gap="xs">
                            <LanguageSwitcher/>
                            <ThemeToggle/>
                        </Group>
                    </div>
                )}
            </Flex>
        </>
    );
}
