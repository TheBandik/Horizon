import { useEffect, useState } from 'react';

import { InputBase, Stack, Textarea, Group, MultiSelect, Button, Text, Image, SimpleGrid, Modal, Space, Select, Autocomplete } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { IconUpload } from '@tabler/icons-react';

import { getMediaTypes, getGenres, getRoles, getParticipants, createMedia } from '../api/media';
import { commonInputProps } from './styles/props'


export function CreateMedia() {
    const [opened, { open, close }] = useDisclosure(false);
    const [inputs, setInputs] = useState<{ participant: string, role: string }[]>([{ participant: "", role: "" }]);

    const [title, setTitle] = useState("");
    const [originalTitle, setOriginalTitle] = useState("");
    const [description, setDescription] = useState("");
    const [releaseDate, setReleaseDate] = useState<Date | null>(null);
    const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [poster, setPoster] = useState<File | null>(null);


    const [mediaTypeOptions, setMediaTypeOptions] = useState<{ value: string; label: string }[]>([]);
    const [genreOptions, setGenreOptions] = useState<{ value: string; label: string }[]>([]);
    const [rolesOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);
    const [participantsOptions, setParticipantOptions] = useState<{ value: string; label: string }[]>([]);

    const handleAddInput = () => {
        setInputs([...inputs, { participant: "", role: "" }]);
    };

    const handleRemoveInput = (index: number) => {
        const newInputs = inputs.filter((_, i) => i !== index);
        setInputs(newInputs);
    };

    const handleInputChange = (index: number, field: "participant" | "role", value: string) => {
        const newInputs = [...inputs];
        newInputs[index][field] = value;
        setInputs(newInputs);
    };

    const convertFileToBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const handleSubmit = async () => {
        const mediaData = {
            title,
            original_title: originalTitle,
            release_date: releaseDate ? releaseDate.toISOString().split("T")[0] : undefined,
            description,
            media_type: selectedMediaType,
            genres: selectedGenres,
            participants: inputs.map(input => ({
                participant: input.participant,
                role: input.role
            })),
            poster: poster ? await convertFileToBase64(poster) : undefined,
        };

        await createMedia(mediaData);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const mediaTypesData = await getMediaTypes();
                const genres = await getGenres();
                const roles = await getRoles();
                const participants = await getParticipants()

                setMediaTypeOptions(mediaTypesData);
                setGenreOptions(genres)
                setRoleOptions(roles)
                setParticipantOptions(participants)
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <Stack mx="xl" my="xl">
            <Group grow>
                <SimpleGrid cols={2} spacing="xl" verticalSpacing="xl">
                    <InputBase
                        label="Title"
                        placeholder="Title of media"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        {...commonInputProps}
                    />
                    <InputBase
                        label="Original Title"
                        placeholder="Original Title of media"
                        onChange={(e) => setOriginalTitle(e.target.value)}
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
                    <Select
                        label="Media Type"
                        placeholder="Pick media type"
                        value={selectedMediaType}
                        onChange={setSelectedMediaType}
                        data={mediaTypeOptions}
                        searchable
                        {...commonInputProps}
                    />
                    <MultiSelect
                        label="Genres"
                        placeholder="Pick genre"
                        data={genreOptions}
                        value={selectedGenres}
                        onChange={setSelectedGenres}
                        searchable

                        {...commonInputProps}
                    />
                </SimpleGrid>
                <Dropzone
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        aspectRatio: "2 / 3",
                        width: "300px",
                        height: "450px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onDrop={(files) => setPoster(files[0])}
                    onReject={() => console.log('File rejected')}
                    accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.webp]}

                >
                    {poster ? (
                        <Image
                            src={URL.createObjectURL(poster)}
                            alt="Poster preview"
                            radius="md"
                        />
                    ) : (
                        <Stack align="center" justify="center">
                            <IconUpload size={32} />
                            <Text size="sm">Drag image here</Text>
                        </Stack>
                    )}
                </Dropzone>
            </Group>
            <Modal opened={opened} onClose={close} title="Participants" size="auto" centered>
                {inputs.map((input, index) => (
                    <div key={index}>
                        <Group>
                            <Autocomplete
                                label={`Participant ${index + 1}`}
                                value={input.participant}
                                onChange={(value) => handleInputChange(index, "participant", value || "")}
                                data={participantsOptions}
                                {...commonInputProps}
                            />
                            <Autocomplete
                                label={`Role of Participant ${index + 1}`}
                                value={input.role}
                                onChange={(value) => handleInputChange(index, "role", value || "")}
                                data={rolesOptions}
                                {...commonInputProps}
                            />
                            {inputs.length > 1 && (
                                <Button color="red" onClick={() => handleRemoveInput(index)}>
                                    Remove
                                </Button>
                            )}
                        </Group>
                        <Space h="sm" />
                    </div>
                ))}
                <Group style={{ marginTop: 20 }}>
                    <Button onClick={handleAddInput}>+</Button>
                </Group>
            </Modal>

            <Button variant="default" onClick={open}>
                Add Participants
            </Button>
            <Textarea
                label="Description"
                placeholder="Description of media"
                autosize
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxRows={10}
                {...commonInputProps}
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
                    onClick={handleSubmit}
                >
                    Create
                </Button>

            </Group>
        </Stack>
    );
}
