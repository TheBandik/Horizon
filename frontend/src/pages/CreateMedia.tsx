import { useEffect, useState } from 'react';

import { InputBase, Container, Textarea, NativeSelect } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { getMediaTypes } from '../api/media';

const commonInputProps = {
    radius: "md",
};

export function CreateMedia() {
    const [releaseDate, setReleaseDate] = useState<Date | null>(null);
    const [mediaType, setMediaType] = useState('');
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMediaTypes();
                setOptions(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <Container>
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
            <NativeSelect
                label= "Media Type"
                value={mediaType}
                onChange={(event) => setMediaType(event.currentTarget.value)}
                data={options}
            />
        </Container>
    );
}
