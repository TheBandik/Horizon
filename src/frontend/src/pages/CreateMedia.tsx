import {
    Flex, Group, MultiSelect, Select,
    Stack, Textarea,
    TextInput, Image, Text, Button, SimpleGrid
} from '@mantine/core';
import {ThemeToggle} from "../components/ThemeToggle.tsx";
import {LanguageSwitcher} from "../components/LanguageSwitcher.tsx";
// import {useTranslation} from 'react-i18next';
import {useMediaQuery} from '@mantine/hooks';
import {DateInput} from "@mantine/dates";
import {Dropzone, MIME_TYPES} from "@mantine/dropzone";
import {IconUpload} from "@tabler/icons-react";
import {useState} from "react";

export function CreateMedia() {

    // const {t} = useTranslation();
    const isMobile = useMediaQuery('(max-width: 600px)');
    const [poster, setPoster] = useState<File | null>(null);

    return (
        <Flex
            align={"center"}
            justify={"space-around"}
        >
            <Stack
                justify={"space-around"}
                h={"100vh"}
            >
                    <SimpleGrid
                        cols={2}
                    >
                        <TextInput
                            label={"Title"}
                            placeholder={"Title of Media"}
                        />
                        <DateInput
                            label={"Release Date"}
                            placeholder={"Title of Media"}
                        />
                        <MultiSelect
                            label="Genres"
                            placeholder="Pick genre"
                            data={['Test', 'Test1', 'Test2', 'Test3']}
                            searchable
                            nothingFoundMessage="Nothing found..."
                        />
                        <TextInput
                            label={"Original Title"}
                            placeholder={"Original Title of Media"}
                        />
                        <Select
                            label="Media Type"
                            placeholder="Pick media type"
                            searchable
                            nothingFoundMessage="Nothing found..."
                        />
                        <TextInput
                            label={"Participants"}
                            placeholder={"Choose Participants"}
                        />
                    </SimpleGrid>
                <Textarea
                    label={"Description"}
                    autosize
                    minRows={4}
                    maxRows={8}
                />
            </Stack>

            <Stack>
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
                            <IconUpload size={32}/>
                            <Text size="sm">Drag poster here</Text>
                        </Stack>
                    )}
                </Dropzone>

                <Flex
                    align={"center"}
                    justify={"space-around"}
                >
                    <Button>Cancel</Button>
                    <Button>Create</Button>
                </Flex>
            </Stack>

            {!isMobile && (
                <div style={{position: 'absolute', right: 20, bottom: 15}}>
                    <Group gap="xs">
                        <LanguageSwitcher/>
                        <ThemeToggle/>
                    </Group>
                </div>
            )}
        </Flex>

    );
}

