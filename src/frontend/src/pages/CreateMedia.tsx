import {
    Flex,
    Group,
    MultiSelect,
    Select,
    Stack,
    TextInput,
    Image,
    Text,
    Button,
    SimpleGrid,
    Loader,
} from "@mantine/core";
import { ThemeToggle } from "../components/ThemeToggle.tsx";
import { LanguageSwitcher } from "../components/LanguageSwitcher.tsx";
import { useMediaQuery } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { getMediaTypes, type MediaTypeDto } from "../api/mediaTypes.ts";
import { getGenres, type GenreDto } from "../api/genres.ts";
import { getSeries, type SeriesDto } from "../api/series.ts";
import { createMedia } from "../api/media.ts";

type Option = { value: string; label: string };

export function CreateMedia() {
    const isMobile = useMediaQuery("(max-width: 600px)");

    // form state
    const [title, setTitle] = useState("");
    const [originalTitle, setOriginalTitle] = useState("");
    const [releaseDate, setReleaseDate] = useState<string | null>(null);
    const [mediaTypeId, setMediaTypeId] = useState<string | null>(null);
    const [genres, setGenresState] = useState<string[]>([]);
    const [series, setSeriesState] = useState<string[]>([]);
    const [poster, setPoster] = useState<File | null>(null);

    const [mediaTypes, setMediaTypes] = useState<MediaTypeDto[]>([]);
    const [genresData, setGenresData] = useState<GenreDto[]>([]);
    const [seriesData, setSeriesData] = useState<SeriesDto[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        Promise.all([
            getMediaTypes({ signal: controller.signal }),
            getGenres({ signal: controller.signal }),
            getSeries({ signal: controller.signal }),
        ])
            .then(([mt, g, s]) => {
                setMediaTypes(mt);
                setGenresData(g);
                setSeriesData(s);
            })
            .catch((e) => {
                if (e?.name === "AbortError") return;
                setError(e?.message ?? "Failed to load form data");
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    const mediaTypeOptions: Option[] = useMemo(
        () =>
            mediaTypes.map((mt) => ({
                value: String(mt.id),
                label: mt.name,
            })),
        [mediaTypes],
    );

    const genreOptions: Option[] = useMemo(
        () =>
            genresData.map((g) => ({
                value: String(g.id),
                label: g.name,
            })),
        [genresData],
    );

    const seriesOptions: Option[] = useMemo(
        () =>
            seriesData.map((s) => ({
                value: String(s.id),
                label: s.title,
            })),
        [seriesData],
    );

    const posterPreviewUrl = useMemo(() => {
        if (!poster) return null;
        return URL.createObjectURL(poster);
    }, [poster]);

    useEffect(() => {
        return () => {
            if (posterPreviewUrl) URL.revokeObjectURL(posterPreviewUrl);
        };
    }, [posterPreviewUrl]);

    async function onCreate() {
        if (!title.trim()) {
            alert("Title is required");
            return;
        }
        if (!releaseDate) {
            alert("Release date is required");
            return;
        }
        if (!mediaTypeId) {
            alert("Media type is required");
            return;
        }

        if (!releaseDate) {
            alert("Release date is required");
            return;
        }

        const payload = {
            title: title.trim(),
            originalTitle: originalTitle.trim() || null,
            releaseDate,
            mediaTypeId: Number(mediaTypeId),
            series: series.map(Number),
            genres: genres.map(Number),
        };

        setSubmitLoading(true);
        try {
            await createMedia({ request: payload, poster });

            alert("Created");

            setTitle("");
            setOriginalTitle("");
            setReleaseDate(null);
            setMediaTypeId(null);
            setGenresState([]);
            setSeriesState([]);
            setPoster(null);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Create failed";
            console.error(e);
            alert(message);
        } finally {
            setSubmitLoading(false);
        }
    }

    function onCancel() {
        setTitle("");
        setOriginalTitle("");
        setReleaseDate(null);
        setMediaTypeId(null);
        setGenresState([]);
        setSeriesState([]);
        setPoster(null);
    }

    const formDisabled = loading || !!error || submitLoading;

    return (
        <Flex align="center" justify="space-around">
            <Stack justify="space-around" h="100vh">
                {loading ? (
                    <Group>
                        <Loader size="sm" />
                        <Text size="sm">Loading…</Text>
                    </Group>
                ) : error ? (
                    <Stack gap="xs">
                        <Text c="red" size="sm">
                            {error}
                        </Text>
                        <Button
                            variant="default"
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            Reload
                        </Button>
                    </Stack>
                ) : (
                    <>
                        <SimpleGrid cols={2}>
                            <TextInput
                                label="Title"
                                placeholder="Title of Media"
                                value={title}
                                onChange={(e) => setTitle(e.currentTarget.value)}
                                required
                                disabled={formDisabled}
                            />

                            <DateInput
                                label="Release Date"
                                placeholder="Pick date"
                                value={releaseDate}
                                onChange={setReleaseDate}
                                valueFormat="YYYY-MM-DD"
                                clearable
                            />

                            <MultiSelect
                                label="Genres"
                                placeholder="Pick genres"
                                data={genreOptions}
                                value={genres}
                                onChange={setGenresState}
                                searchable
                                nothingFoundMessage="Nothing found..."
                                disabled={formDisabled}
                            />

                            <TextInput
                                label="Original Title"
                                placeholder="Original Title of Media"
                                value={originalTitle}
                                onChange={(e) => setOriginalTitle(e.currentTarget.value)}
                                disabled={formDisabled}
                            />

                            <Select
                                label="Media Type"
                                placeholder="Pick media type"
                                data={mediaTypeOptions}
                                value={mediaTypeId}
                                onChange={setMediaTypeId}
                                searchable
                                nothingFoundMessage="Nothing found..."
                                required
                                disabled={formDisabled}
                            />

                            <MultiSelect
                                label="Series"
                                placeholder="Pick series"
                                data={seriesOptions}
                                value={series}
                                onChange={setSeriesState}
                                searchable
                                nothingFoundMessage="Nothing found..."
                                disabled={formDisabled}
                            />
                        </SimpleGrid>
                    </>
                )}
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
                        justifyContent: "center",
                    }}
                    onDrop={(files) => setPoster(files[0] ?? null)}
                    onReject={() => console.log("File rejected")}
                    accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.webp]}
                    multiple={false}
                    disabled={loading || !!error || submitLoading}
                >
                    {posterPreviewUrl ? (
                        <Image src={posterPreviewUrl} alt="Poster preview" radius="md" />
                    ) : (
                        <Stack align="center" justify="center">
                            <IconUpload size={32} />
                            <Text size="sm">Drag poster here</Text>
                        </Stack>
                    )}
                </Dropzone>

                <Flex align="center" justify="space-around">
                    <Button variant="default" onClick={onCancel} disabled={submitLoading}>
                        Cancel
                    </Button>
                    <Button onClick={onCreate} loading={submitLoading} disabled={loading || !!error}>
                        Create
                    </Button>
                </Flex>
            </Stack>

            {!isMobile && (
                <div style={{ position: "absolute", right: 20, bottom: 15 }}>
                    <Group gap="xs">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </Group>
                </div>
            )}
        </Flex>
    );
}
