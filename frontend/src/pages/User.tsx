import { useState } from 'react';
import {
    IconHospital,
    IconMovie,
    IconBook,
    IconDeviceGamepad2,
    IconSearch,
    IconUser,
} from '@tabler/icons-react';
import { Text, Group, Burger, Card, Image, AspectRatio, AppShell, ScrollArea, Grid, Stack, Combobox, useCombobox, InputBase, CloseButton, Anchor } from '@mantine/core';
import { LinksGroup } from '../components/NavbarLinksGroup';
import { useDisclosure } from '@mantine/hooks';
import classes from './styles/NavbarNested.module.css';

import { commonInputProps } from './styles/props'

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

const movies = [
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
];

const media = [
    {
        label: 'Movies',
        options: [
            { title: 'The Witcher 3', poster: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg' },
            { title: 'Cyberpunk 2077', poster: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg' },
            { title: 'Red Dead Redemption 2', poster: 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg' },
        ],
    },
    {
        label: 'Games',
        options: [
            { title: 'The Witcher 3', poster: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg' },
            { title: 'Cyberpunk 2077', poster: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg' },
            { title: 'Red Dead Redemption 2', poster: 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg' },
        ],
    },
];


const allMediaTitles = media.reduce<string[]>(
    (acc, group) => [...acc, ...group.options.map((item) => item.title)],
    []
);

export function User() {
    const [opened, { toggle }] = useDisclosure();
    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

    const movieCards = movies.map((movie) => (
        <Grid.Col span={2} m="xl">
            <Stack>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                        <AspectRatio ratio={2 / 3}>
                            <Image
                                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                                height="100%"
                                width="100%"
                                alt="Norway"
                            />
                        </AspectRatio>
                    </Card.Section>
                </Card>
                <Text size="sm" ta="center">
                    {movie.title}
                </Text>
            </Stack>
        </Grid.Col>
    ));

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const shouldFilterOptions = allMediaTitles.every((title) => title !== search);
    const filteredGroups = media.map((group) => {
        const filteredOptions = shouldFilterOptions
            ? group.options.filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase().trim())
            )
            : group.options;

        return { ...group, options: filteredOptions };
    });

    const totalOptions = filteredGroups.reduce(
        (acc, group) => acc + group.options.length,
        0
    );

    const groups = filteredGroups.map((group) => {
        const options = group.options.map((item) => (
            <Combobox.Option value={item.title} key={item.title}>
                <Group>
                    <AspectRatio ratio={2 / 3} style={{ width: '10%' }}>
                        <Image
                            src={item.poster}
                            alt={item.title}
                            radius="md"
                            style={{ width: '100%', height: '100%' }}
                        />
                    </AspectRatio>
                    {item.title}
                </Group>
            </Combobox.Option>
        ));

        return (
            <Combobox.Group label={group.label} key={group.label}>
                {options}
            </Combobox.Group>
        );
    });

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group>
                        <IconHospital color="orange" />
                        <Text>Horizon</Text>
                    </Group>
                    <Group>
                        <Combobox
                            store={combobox}
                            withinPortal={false}
                            onOptionSubmit={(val) => {
                                setValue(val);
                                setSearch(val);
                                combobox.closeDropdown();
                            }}
                        >
                            <Combobox.Target>
                                <InputBase
                                    leftSection={<IconSearch size={18} />}
                                    placeholder="Find new media"
                                    w="500"
                                    value={search}
                                    onChange={(event) => {
                                        combobox.openDropdown();
                                        combobox.updateSelectedOptionIndex();
                                        setSearch(event.currentTarget.value);
                                    }}
                                    onClick={() => combobox.openDropdown()}
                                    onFocus={() => combobox.openDropdown()}
                                    onBlur={() => {
                                        combobox.closeDropdown();
                                        setSearch(value || '');
                                    }}
                                    rightSection={
                                        value !== null || search !== '' ? (
                                            <CloseButton
                                                size="sm"
                                                onMouseDown={(event) => event.preventDefault()}
                                                onClick={() => { setValue(null); setSearch('') }}
                                                aria-label="Clear value"
                                            />
                                        ) : (null)
                                    }
                                    rightSectionPointerEvents={'all'}
                                    {...commonInputProps}
                                />
                            </Combobox.Target>

                            <Combobox.Dropdown>
                                <ScrollArea.Autosize mah={500} type="never" overscrollBehavior="none">
                                    {totalOptions > 0 ? groups : <Combobox.Empty>Nothing found</Combobox.Empty>}
                                </ScrollArea.Autosize>
                                <Combobox.Footer>
                                    <Text fz="xs" c="dimmed">
                                    Didn't find what you need?{' '}
                                        <Anchor fz="xs" href="http://localhost:5173/media" target="_blank">
                                            Create
                                        </Anchor>
                                    </Text>
                                </Combobox.Footer>
                            </Combobox.Dropdown>
                        </Combobox>
                        <IconUser />
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <ScrollArea className={classes.links}>
                    <div className={classes.linksInner}>{links}</div>
                </ScrollArea>
            </AppShell.Navbar>

            <AppShell.Main>
                <Grid gutter="xl" justify="space-around" m="xl" >
                    {movieCards}
                </Grid>
            </AppShell.Main>
        </AppShell>
    );
}
