import { useEffect, useState } from 'react';

import { InputBase, Stack, Textarea, Group, MultiSelect, Button } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { getMediaTypes, getGenres } from '../api/media';

const commonInputProps = {
    radius: "md",
};

export function CreateMedia() {
    const [releaseDate, setReleaseDate] = useState<Date | null>(null);
    const [selectedMediaType, setSelectedMediaType] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);


    const [mediaTypeOptions, setMediaTypeOptions] = useState<{ value: string; label: string }[]>([]);
    const [genreOptions, setGenreOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const mediaTypesData = await getMediaTypes();
                // const genres = await getGenres();

                setMediaTypeOptions(mediaTypesData);
                // setGenreOptions(genres)
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <Stack mx="xl">
            <InputBase
                label="Title"
                placeholder="Title of media"
                {...commonInputProps}
            />
            <InputBase
                label="Original Title"
                placeholder="Original Title of media"
                {...commonInputProps}
            />
            <Textarea
                label="Description"
                placeholder="Description of media"
                autosize
                maxRows={10}
                {...commonInputProps}
            />
            <DateInput
                value={releaseDate}
                onChange={setReleaseDate}
                label="Date input"
                placeholder="Date input"
                description="First offical release date"
                {...commonInputProps}
            />
            <MultiSelect
                label="Media Type"
                placeholder="Pick media type"
                value={selectedMediaType}
                onChange={setSelectedMediaType}
                data={mediaTypeOptions}
                searchable
                maxValues={1}
            />
            <MultiSelect
                label="Genres"
                placeholder="Pick genre"
                data={genreOptions}
                value={selectedGenres}
                onChange={setSelectedGenres}
                searchable
            />
            <Group justify="flex-end" >
                <Button
                    variant="gradient"
                    gradient={{ from: 'red', to: 'pink', deg: 180 }}
                >
                    Cancel
                </Button>

                <Button
                    variant="gradient"
                    gradient={{ from: 'yellow', to: 'orange', deg: 180 }}
                >
                    Create
                </Button>

            </Group>
        </Stack>
    );
}
