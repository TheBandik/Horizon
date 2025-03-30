import {
    IconHospital,
    IconMovie,
    IconBook,
    IconDeviceGamepad2,
} from '@tabler/icons-react';
import { Text, Group, Burger, Card, Image, AspectRatio, AppShell, ScrollArea, Grid, Stack } from '@mantine/core';
import { LinksGroup } from '../components/NavbarLinksGroup';
import { useDisclosure } from '@mantine/hooks';
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
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
    { title: 'Inception', category: 'Movie', posterUrl: '/path/to/inception.jpg' },
    { title: 'Interstellar', category: 'Movie', posterUrl: '/path/to/interstellar.jpg' },
    { title: 'The Dark Knight', category: 'Movie', posterUrl: '/path/to/dark-knight.jpg' },
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

export function User() {
    const [opened, { toggle }] = useDisclosure();
    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

    const movieCards = movies.map((movie) => (
        <Grid.Col span={2} m="xl">
            <Stack>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                        <AspectRatio ratio={27 / 40}>
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

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <IconHospital color="orange" />
                    <Text>Horizon</Text>
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
