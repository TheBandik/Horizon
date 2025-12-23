import {
    IconBat,
    IconBook2,
    IconDeviceGamepad2,
    IconDeviceTv,
    IconLogout,
    IconMovie,
    IconPlus,
    IconSearch,
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
import { useEffect, useMemo, useState } from "react";
import { type MediaResponse, searchMedia } from "../api/media.ts";
import { MediaEditModal } from "../components/MediaEditModal";
import {
    createMediaUser,
    type DatePrecision,
    type MediaUserCreateRequest,
} from "../api/mediaUser.ts";

type PartialDateValue = { day: string; month: string; year: string };

function pad2(v: string) {
    return v.padStart(2, "0").slice(0, 2);
}

function buildEventDatePayload(date: PartialDateValue): {
    eventDate: string | null;
    precision: DatePrecision | null;
} {
    const y = date.year.trim();
    const m = date.month.trim();
    const d = date.day.trim();

    if (!y) return { eventDate: null, precision: null };

    if (y && m && d) {
        return {
            eventDate: `${y}-${pad2(m)}-${pad2(d)}`,
            precision: "DAY",
        };
    }

    if (y && m) {
        return {
            eventDate: `${y}-${pad2(m)}-01`,
            precision: "MONTH",
        };
    }

    return {
        eventDate: `${y}-01-01`,
        precision: "YEAR",
    };
}

function normalizeRating(rating: number | null): number | null {
    if (rating == null) return null;
    const v = Math.trunc(rating);
    if (Number.isNaN(v)) return null;
    return Math.max(1, Math.min(10, v));
}

export function UserProfile() {
    const [active, setActive] = useState("Billing");
    const isMobile = useMediaQuery("(max-width: 600px)");

    const [query, setQuery] = useState("");
    const [debounced] = useDebouncedValue(query, 250);

    const [results, setResults] = useState<MediaResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    /** ===== modal state ===== */
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [modalItem, setModalItem] = useState<MediaResponse | null>(null);

    const [rating, setRating] = useState<number | null>(null);

    const [partialDate, setPartialDate] = useState<PartialDateValue>({
        day: "",
        month: "",
        year: "",
    });

    const [statusId, setStatusId] = useState<number | null>(null);

    const userId = 1; // TODO: подставь реальный userId

    const openItemModal = (item: MediaResponse) => {
        combobox.closeDropdown();

        setModalItem(item);
        setRating(null);
        setPartialDate({ day: "", month: "", year: "" });
        setStatusId(null);

        openModal();
    };

    const submittingDisabled = useMemo(() => {
        // минимальная защита от пустого запроса
        if (!modalItem) return true;
        if (!userId) return true;
        if (!statusId) return true;
        return false;
    }, [modalItem, userId, statusId]);

    const handleSubmit = async () => {
        if (!modalItem) return;

        if (!statusId) {
            alert("Выбери статус");
            return;
        }

        const { eventDate, precision } = buildEventDatePayload(partialDate);

        const body: MediaUserCreateRequest = {
            mediaId: Number(modalItem.id),
            userId: Number(userId),
            statusId: Number(statusId),
            rating: normalizeRating(rating),
            eventDate,
            precision,
        };

        try {
            await createMediaUser({ body });
            closeModal();
        } catch (e: any) {
            alert(e?.message ?? "Не удалось сохранить");
        }
    };

    /** ===== search ===== */
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
            } catch (e: any) {
                if (e?.name === "AbortError") return;
                setError(e?.message ?? "Search failed");
                setResults([]);
                combobox.closeDropdown();
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [debounced]);

    const { t } = useTranslation();

    const data = [
        { link: "", label: t("games"), icon: IconDeviceGamepad2 },
        { link: "", label: t("movies"), icon: IconMovie },
        { link: "", label: t("series"), icon: IconDeviceTv },
        { link: "", label: t("books"), icon: IconBook2 },
        { link: "", label: t("comics"), icon: IconBat },
    ];

    // Тестовые данные таблицы
    const elements = [
        {
            title: "Game",
            original_title: "Game",
            release_date: "12.04.2023",
            franchise: "Franchise",
            user_status: "Status",
            rating: 5,
        },
    ];

    const rows = elements.map((element) => (
        <Table.Tr key={element.title}>
            <Table.Td>{element.title}</Table.Td>
            <Table.Td>{element.original_title}</Table.Td>
            <Table.Td>{element.release_date}</Table.Td>
            <Table.Td>{element.franchise}</Table.Td>
            <Table.Td>{element.user_status}</Table.Td>
            <Table.Td>{element.rating}</Table.Td>
        </Table.Tr>
    ));

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
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
                onStatusIdChange={setStatusId}
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
                        {links}
                    </div>

                    <div className={classes.footer}>
                        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                            <span>TheBandik</span>
                        </a>

                        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
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
                                    leftSection={<IconSearch size={18} stroke={1.5} />}
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

                                    {!error && results.length === 0 && !loading && (
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
                                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                    <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                                                        <span style={{ fontWeight: 600 }}>
                                                            {m.title ?? m.originalTitle ?? "Untitled"}
                                                        </span>
                                                        <span style={{ opacity: 0.7, fontSize: 12 }}>
                                                            {m.mediaType?.code}
                                                            {m.releaseDate ? ` • ${m.releaseDate.slice(0, 4)}` : ""}
                                                        </span>
                                                    </div>

                                                    {m.originalTitle && m.title && m.originalTitle !== m.title && (
                                                        <span style={{ opacity: 0.7, fontSize: 12 }}>
                                                            {m.originalTitle}
                                                        </span>
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
                                                    <IconPlus size={16} stroke={1.5} />
                                                </ActionIcon>
                                            </div>
                                        </Combobox.Option>
                                    ))}
                                </Combobox.Options>
                            </Combobox.Dropdown>
                        </Combobox>

                        <ActionIcon size={40} radius="xl" variant="filled" ml={"xs"}>
                            <IconPlus size={18} stroke={1.5} />
                        </ActionIcon>
                    </Flex>

                    <SegmentedControl
                        data={["All (245)", "Wanted (45)", "Played (110)", "Beaten (50)", "Dropped (40)"]}
                        classNames={classes}
                    />

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
