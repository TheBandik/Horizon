import {useState} from 'react';
import {
    IconLogout,
    IconDeviceGamepad2,
    IconMovie,
    IconDeviceTv,
    IconBook2,
    IconBat,
    IconSearch,
    IconPlus
} from '@tabler/icons-react';
import {Text, Group, Flex, Stack, TextInput, ActionIcon, SegmentedControl, Table} from '@mantine/core';
import classes from './styles/UserProfile.module.css';
import packageJson from '../../package.json';
import {LanguageSwitcher} from "../components/LanguageSwitcher.tsx";
import {ThemeToggle} from "../components/ThemeToggle.tsx";
import {useMediaQuery} from "@mantine/hooks";
import {useTranslation} from "react-i18next";


export function UserProfile() {
    const [active, setActive] = useState('Billing');
    const isMobile = useMediaQuery('(max-width: 600px)');

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
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
        {title: "Game", original_title: "Game", release_date: "12.04.2023", franchise: "Franchise", user_status: "Status", rating: 5},
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
                    <TextInput
                        size={"md"}
                        placeholder="Search media"
                        w={"50vw"}
                        leftSection={<IconSearch size={18} stroke={1.5}/>}
                    />
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