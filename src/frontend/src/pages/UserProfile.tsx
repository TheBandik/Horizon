import {
    IconBat,
    IconBook2,
    IconDeviceGamepad2,
    IconDeviceTv,
    IconLogout,
    IconMovie,
    IconPlus,
    IconSearch
} from '@tabler/icons-react';
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
    useCombobox
} from '@mantine/core';
import classes from './styles/UserProfile.module.css';
import packageJson from '../../package.json';
import {LanguageSwitcher} from "../components/LanguageSwitcher.tsx";
import {ThemeToggle} from "../components/ThemeToggle.tsx";
import {useDebouncedValue, useMediaQuery} from "@mantine/hooks";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {type MediaResponse, searchMedia} from "../api/media.ts";


export function UserProfile() {
    const [active, setActive] = useState('Billing');
    const isMobile = useMediaQuery('(max-width: 600px)');

    const [query, setQuery] = useState("");
    const [debounced] = useDebouncedValue(query, 250);

    const [results, setResults] = useState<MediaResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

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

                console.log("search q=", q);

                const data = await searchMedia({q, page: 0, size: 10, signal: controller.signal});

                console.log("search response items=", data.items?.length, data);

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


    const {t} = useTranslation();

    const data = [
        {link: '', label: t("games"), icon: IconDeviceGamepad2},
        {link: '', label: t("movies"), icon: IconMovie},
        {link: '', label: t("series"), icon: IconDeviceTv},
        {link: '', label: t("books"), icon: IconBook2},
        {link: '', label: t("comics"), icon: IconBat},
    ];

    // Тестовые данные
    const elements = [
        {
            title: "Game",
            original_title: "Game",
            release_date: "12.04.2023",
            franchise: "Franchise",
            user_status: "Status",
            rating: 5
        }
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
            <item.icon className={classes.linkIcon} stroke={1.5}/>
            <span>{item.label}</span>
        </a>
    ));

    return (
        <Flex>
            <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                    <Group className={classes.header} justify="space-between">
                        <Text
                            fw={700}
                            size={"40px"}
                            variant={"gradient"}
                        >
                            Horizon
                        </Text>
                        <Text
                            fw={700}
                            size={"15px"}
                        >
                            {packageJson.version}</Text>
                    </Group>
                    {links}
                </div>

                <div className={classes.footer}>
                    <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                        <span>TheBandik</span>
                    </a>

                    <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                        <IconLogout className={classes.linkIcon} stroke={1.5}/>
                        <span>{t("logout")}</span>
                    </a>
                </div>
            </nav>

            <Stack
                align={"center"}
                w={"100vw"}
            >
                <Flex
                    align={"center"}
                    mt={"4%"}
                >
                    <Combobox
                        store={combobox}
                        withinPortal={false}
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
                                leftSection={<IconSearch size={18} stroke={1.5}/>}
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

                                {!error && results.length === 0 && !loading && (
                                    <Combobox.Empty>Nothing found</Combobox.Empty>
                                )}

                                {results.map((m) => (
                                    <Combobox.Option key={m.id} value={String(m.id)}>
                                        <div style={{display: "flex", flexDirection: "column", gap: 2}}>
                                            <div style={{display: "flex", gap: 8, alignItems: "baseline"}}>
              <span style={{fontWeight: 600}}>
                {m.title ?? m.originalTitle ?? "Untitled"}
              </span>
                                                <span style={{opacity: 0.7, fontSize: 12}}>
                {m.mediaType?.code}
                                                    {m.releaseDate ? ` • ${m.releaseDate.slice(0, 4)}` : ""}
              </span>
                                            </div>

                                            {m.originalTitle && m.title && m.originalTitle !== m.title && (
                                                <span style={{opacity: 0.7, fontSize: 12}}>
                {m.originalTitle}
              </span>
                                            )}
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
                    >
                        <IconPlus size={18} stroke={1.5}/>
                    </ActionIcon>
                </Flex>
                <SegmentedControl
                    // TODO: Статусы брать из БД + считать количество
                    data={["All (245)", "Wanted (45)", "Played (110)", "Beaten (50)", "Dropped (40)"]}
                    classNames={classes}
                />

                <Table.ScrollContainer
                    maxHeight={"68vh"}
                    minWidth={"75vw"}
                >
                    <Table
                        striped
                        highlightOnHover
                        withRowBorders={false}
                        horizontalSpacing={"lg"}
                    >
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
                <div style={{position: "absolute", right: 20, bottom: 15}}>
                    <Group gap="xs">
                        <LanguageSwitcher/>
                        <ThemeToggle/>
                    </Group>
                </div>
            )}
        </Flex>

    );
}