import {
    IconHospital,
    IconMovie,
    IconBook,
    IconDeviceGamepad2,
} from '@tabler/icons-react';
import { Text, Group, ScrollArea } from '@mantine/core';
import { LinksGroup } from '../components/NavbarLinksGroup'
import { UserButton } from '../components/UserButton';
import classes from './styles/NavbarNested.module.css';

const mockdata = [
    {
        label: 'Movies',
        icon: IconMovie,
        initiallyOpened: true,
        links: [
            { label: 'Want', link: '/' },
            { label: 'Watched', link: '/' },
            { label: 'Dropped', link: '/' },
        ],
    },
    {
        label: 'Books',
        icon: IconBook,
        links: [
            { label: 'Want', link: '/' },
            { label: 'Read', link: '/' },
            { label: 'Dropped', link: '/' },
        ],
    },
    {
        label: 'Games',
        icon: IconDeviceGamepad2,
        links: [
            { label: 'Want', link: '/' },
            { label: 'Played', link: '/' },
            { label: 'Completed', link: '/' },
            { label: 'Dropped', link: '/' },
        ],
    },
];

export function User() {
    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav className={classes.navbar}>
            <div className={classes.header}>
                <Group justify="center" gap="xs">
                    <IconHospital color="orange" />
                    <Text>Horizon</Text>
                </Group>
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
                <UserButton />
            </div>
        </nav>
    );
}
