import {ActionIcon, Menu} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {IconWorld} from '@tabler/icons-react';
import cx from 'clsx';
import classes from './styles/ThemeToggle.module.css';

export function LanguageSwitcher() {
    const {i18n} = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <Menu position="top-end">
            <Menu.Target>
                <ActionIcon
                    variant="default"
                    size="xl"
                    aria-label="Toggle language"
                >
                    <IconWorld className={cx(classes.icon)} stroke={1.5}/>
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown
                p="sm"
            >
                <Menu.Item onClick={() => changeLanguage('ru')}>🇷🇺 Русский</Menu.Item>
                <Menu.Item onClick={() => changeLanguage('en')}>🇺🇸 English</Menu.Item>
                <Menu.Item onClick={() => changeLanguage('ja')}>🇯🇵 日本語 (beta)</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
