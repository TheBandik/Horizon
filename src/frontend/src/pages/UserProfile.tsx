import {IconLogout, IconPlus, IconTrash} from "@tabler/icons-react";
import {
    ActionIcon,
    Button,
    Combobox,
    Divider,
    Drawer,
    Flex,
    Group,
    Loader,
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
import {type MediaResponse, searchMedia} from "../api/media.ts";
import {MediaEditModal} from "../components/MediaEditModal";
import {createMediaUser, deleteMediaUser, type MediaUserCreateRequest} from "../api/mediaUser.ts";
import {closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
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

export function UserProfile() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");

    const [query, setQuery] = useState("");
    const [debounced] = useDebouncedValue(query, 250);
    const [results, setResults] = useState<MediaResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [modalOpened, {open: openModal, close: closeModal}] = useDisclosure(false);
    const [modalItem, setModalItem] = useState<MediaResponse | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [partialDate, setPartialDate] = useState<PartialDateValue>({day: "", month: "", year: ""});
    const [statusId, setStatusId] = useState<number | null>(null);

    const [detailsOpened, {open: openDetails, close: closeDetails}] = useDisclosure(false);
    const [detailsItem, setDetailsItem] = useState<MediaUserTableItem | null>(null);

    const {mediaTypes, setMediaTypes, active, setActive, activeMediaTypeName} = useMediaTypesNav();
    const {tableItems, refetch, invalidateActive} = useMediaUserTable(active);
    const {statuses} = useStatuses();

    const [statusFilter, setStatusFilter] = useState<string>("ALL");

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
        }),
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

    const openItemModal = (item: MediaResponse) => {
        combobox.closeDropdown();

        setModalItem(item);
        setRating(null);
        setPartialDate({day: "", month: "", year: ""});
        setStatusId(null);

        openModal();
    };

    const openDetailsDrawer = useCallback(
        (x: MediaUserTableItem) => {
            setDetailsItem(x);
            openDetails();
        },
        [openDetails],
    );

    const openEditFromTable = useCallback(
        (x: MediaUserTableItem) => {
            setModalItem(x.media as unknown as MediaResponse);
            setRating(x.rating ?? null);
            setPartialDate({day: "", month: "", year: ""});
            setStatusId(x.status?.id ?? null);

            openModal();
        },
        [openModal],
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
        [invalidateActive, refetch, detailsItem, closeDetails],
    );


    const submittingDisabled = useMemo(() => {
        if (!modalItem) return true;
        return !statusId;
    }, [modalItem, statusId]);

    const resetSearch = useCallback(() => {
        setQuery("");
        setResults([]);
        setError(null);
        setLoading(false);

        combobox.closeDropdown();
        combobox.resetSelectedOption();
    }, [combobox]);

    const handleCloseModal = useCallback(() => {
        closeModal();
        resetSearch();
    }, [closeModal, resetSearch]);

    const handleSubmit = async () => {
        if (!modalItem) return;

        if (!statusId) {
            alert("Выбери статус");
            return;
        }

        const {eventDate, precision} = buildEventDatePayload(partialDate);

        const body: MediaUserCreateRequest = {
            mediaId: Number(modalItem.id),
            statusId: Number(statusId),
            rating: normalizeRating(rating),
            eventDate,
            precision,
        };

        try {
            await createMediaUser({body});
            invalidateActive();
            await refetch();
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

                const data = await searchMedia({q, page: 0, size: 10, mediaTypeId: active, signal: controller.signal});

                setResults(data.items);
                if (data.items.length > 0) combobox.openDropdown();
                else combobox.closeDropdown();
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;

                const message = e instanceof Error ? e.message : "Search failed";

                setError(message);
                setResults([]);
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

    return (
        <>
            <Drawer
                opened={detailsOpened}
                onClose={closeDetails}
                title={detailsItem?.media.title ?? detailsItem?.media.originalTitle ?? "Media"}
                position="right"
                size="md"
            >
                {detailsItem && (
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
                                            objectFit: "cover",
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

                                {detailsItem.media.originalTitle &&
                                    detailsItem.media.originalTitle !== detailsItem.media.title && (
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

                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Status</Text>
                                <Group gap="xs">
                                    <Text size="sm" fw={600}>{detailsItem.status.name}</Text>
                                </Group>
                            </Group>

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Rating</Text>
                                <Text size="sm" fw={600}>{detailsItem.rating ?? "—"}</Text>
                            </Group>

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">User Date</Text>
                                <Text size="sm" fw={600}>
                                    {detailsItem.lastEventDate?.slice(0, 10) ?? "—"}
                                </Text>
                            </Group>
                        </Stack>

                        <Divider/>

                        <Group justify="space-between">
                            <Button variant="default" onClick={closeDetails}>
                                Close
                            </Button>

                            <Group>
                                <Button
                                    onClick={() => {
                                        openEditFromTable(detailsItem);
                                        closeDetails();
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="light"
                                    onClick={() => {
                                        handleDeleteFromTable(detailsItem)
                                        closeDetails();
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
                partialDate={partialDate}
                onPartialDateChange={setPartialDate}
                statusId={statusId}
                onStatusIdChange={onStatusIdChange}
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
                                        if (results.length > 0) combobox.openDropdown();
                                    }}
                                    onClick={() => {
                                        if (results.length > 0) combobox.openDropdown();
                                    }}
                                />
                            </Combobox.Target>

                            <Combobox.Dropdown>
                                <Combobox.Options>
                                    {error && <Combobox.Empty>{error}</Combobox.Empty>}

                                    {!error && results.length === 0 && !loading &&
                                        <Combobox.Empty>Nothing found</Combobox.Empty>}

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
                                                        <span style={{fontWeight: 600}}>
                                                            {m.title ?? m.originalTitle ?? "Untitled"}
                                                        </span>
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
