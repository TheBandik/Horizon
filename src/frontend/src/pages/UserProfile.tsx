import {
    IconLogout, IconPlus,
} from "@tabler/icons-react";
import {
    ActionIcon,
    Combobox,
    Flex,
    Group,
    Loader,
    SegmentedControl,
    Stack,
    Table,
    Text,
    TextInput,
    useCombobox,
} from "@mantine/core";
import classes from "./styles/UserProfile.module.css";
import packageJson from "../../package.json";
import { LanguageSwitcher } from "../components/LanguageSwitcher.tsx";
import { ThemeToggle } from "../components/ThemeToggle.tsx";
import { useDebouncedValue, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import {useCallback, useEffect, useMemo, useState} from "react";
import { type MediaResponse, searchMedia } from "../api/media.ts";
import { MediaEditModal } from "../components/MediaEditModal";
import { createMediaUser, type MediaUserCreateRequest } from "../api/mediaUser.ts";
import { closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { logout } from "../api/auth/logout.ts";
import { useNavigate } from "react-router-dom";
import type { StatusDto } from "../api/statuses.ts";

import type { PartialDateValue } from "./userProfile/types";
import { buildEventDatePayload } from "./userProfile/lib/dates";
import { normalizeRating } from "./userProfile/lib/rating";
import { resolveScopeByMediaTypeName } from "./userProfile/lib/mediaType";
import { SortableNavLink } from "./userProfile/components/SortableNavLink";
import { useStatuses } from "./userProfile/hooks/useStatuses";
import { useMediaTypesNav } from "./userProfile/hooks/useMediaTypesNav";
import { useMediaUserTable } from "./userProfile/hooks/useMediaUserTable";

export function UserProfile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");

    // Search combobox
    const [query, setQuery] = useState("");
    const [debounced] = useDebouncedValue(query, 250);
    const [results, setResults] = useState<MediaResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [modalItem, setModalItem] = useState<MediaResponse | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [partialDate, setPartialDate] = useState<PartialDateValue>({ day: "", month: "", year: "" });
    const [statusId, setStatusId] = useState<number | null>(null);

    const { mediaTypes, setMediaTypes, active, setActive, activeMediaTypeName } = useMediaTypesNav();

    const { tableItems } = useMediaUserTable(active);

    const { statuses } = useStatuses();

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
            { label: "All", value: "ALL" },
            ...availableStatuses.map((s: StatusDto) => ({
                label: s.name,
                value: String(s.id),
            })),
        ];
    }, [availableStatuses]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        }),
    );

    const onDragEnd = (event: DragEndEvent) => {
        const { active: a, over } = event;
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
        setPartialDate({ day: "", month: "", year: "" });
        setStatusId(null);

        openModal();
    };

    const submittingDisabled = useMemo(() => {
        if (!modalItem) return true;
        return !statusId;
    }, [modalItem, statusId]);

    const handleSubmit = async () => {
        if (!modalItem) return;

        if (!statusId) {
            alert("Выбери статус");
            return;
        }

        const { eventDate, precision } = buildEventDatePayload(partialDate);

        const body: MediaUserCreateRequest = {
            mediaId: Number(modalItem.id),
            statusId: Number(statusId),
            rating: normalizeRating(rating),
            eventDate,
            precision,
        };

        try {
            await createMediaUser({ body });
            closeModal();
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

                const data = await searchMedia({ q, page: 0, size: 10, signal: controller.signal });

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
    }, [debounced]);

    const filteredTableItems = useMemo(() => {
        if (statusFilter === "ALL") return tableItems;
        const id = Number(statusFilter);
        if (Number.isNaN(id)) return tableItems;
        return tableItems.filter((x) => x.status.id === id);
    }, [tableItems, statusFilter]);

    const onStatusIdChange = useCallback((v: number | null) => {
        setStatusId(v);
    }, []);

    const rows = filteredTableItems.map((x) => (
        <Table.Tr key={x.id}>
            <Table.Td>{x.media.title ?? "—"}</Table.Td>
            <Table.Td>{x.media.originalTitle ?? "—"}</Table.Td>
            <Table.Td>{x.media.releaseDate ?? "—"}</Table.Td>
            <Table.Td>{"—"}</Table.Td>
            <Table.Td>{x.status.name}</Table.Td>
            <Table.Td>{x.rating ?? "—"}</Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <MediaEditModal
                opened={modalOpened}
                onClose={closeModal}
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
                                    <SortableNavLink key={item.id} item={item} activeId={active} onActivate={setActive} />
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
                                navigate("/auth/login", { replace: true });
                            }}
                        >
                            <IconLogout className={classes.linkIcon} stroke={1.5} />
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
                                    leftSection={<span style={{ width: 18 }} />}
                                    rightSection={loading ? <Loader size="xs" /> : null}
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

                                    {!error && results.length === 0 && !loading && <Combobox.Empty>Nothing found</Combobox.Empty>}

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
                                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                    <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                                                        <span style={{ fontWeight: 600 }}>{m.title ?? m.originalTitle ?? "Untitled"}</span>
                                                        <span style={{ opacity: 0.7, fontSize: 12 }}>
                                                            {m.mediaType?.code}
                                                            {m.releaseDate ? ` • ${m.releaseDate.slice(0, 4)}` : ""}
                                                        </span>
                                                    </div>

                                                    {m.originalTitle && m.title && m.originalTitle !== m.title && (
                                                        <span style={{ opacity: 0.7, fontSize: 12 }}>{m.originalTitle}</span>
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
                        <ActionIcon
                            size={40}
                            radius="xl"
                            variant="filled"
                            ml={"xs"}
                            onClick={() => navigate("/create")}
                        >
                            <IconPlus size={18} stroke={1.5}/>
                        </ActionIcon>
                    </Flex>


                    <SegmentedControl data={segmentedData} value={statusFilter} onChange={setStatusFilter} classNames={classes} />

                    <Table.ScrollContainer maxHeight={"68vh"} minWidth={"75vw"}>
                        <Table striped highlightOnHover withRowBorders={false} horizontalSpacing={"lg"}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Title</Table.Th>
                                    <Table.Th>Original Title</Table.Th>
                                    <Table.Th>Release Date</Table.Th>
                                    <Table.Th>Franchise</Table.Th>
                                    <Table.Th>User Status</Table.Th>
                                    <Table.Th>Rating</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Stack>

                {!isMobile && (
                    <div style={{ position: "absolute", right: 20, bottom: 15 }}>
                        <Group gap="xs">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </Group>
                    </div>
                )}
            </Flex>
        </>
    );
}
