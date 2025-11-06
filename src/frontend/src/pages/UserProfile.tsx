import {useState} from 'react';
import {
    IconLogout,
    IconDeviceGamepad2,
    IconMovie,
    IconDeviceTv,
    IconBook2,
    IconBat
} from '@tabler/icons-react';
import {Text, Group, Flex} from '@mantine/core';
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