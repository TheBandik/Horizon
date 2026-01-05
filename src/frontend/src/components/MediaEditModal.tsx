import {
    Button,
    Combobox,
    Divider,
    Flex,
    Group,
    Loader,
    Modal,
    Stack,
    Text,
    TextInput,
    useCombobox,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { RatingPicker } from "./RatingPicker";
import type { MediaResponse } from "../api/media";
import { getStatuses } from "../api/statuses";
import { resolveScopeByMediaTypeName } from "../pages/userProfile/lib/mediaType.ts";
import { PartialDateRow, type PartialDateValue } from "./PartialDateRow";

type StatusScope = "ALL" | "MOVIE" | "BOOK" | "GAME";

type StatusDto = {
    id: number;
    name: string;
    code: string;
    scope: StatusScope;
};

type MediaEditModalProps = {
    opened: boolean;
    onClose: () => void;

    item: MediaResponse | null;

    rating: number | null;
    onRatingChange: (v: number | null) => void;

    statusId: number | null;
    onStatusIdChange: (v: number | null) => void;

    showDate: boolean;
    partialDate: PartialDateValue;
    onPartialDateChange: (v: PartialDateValue) => void;

    onOk: () => void;
    okDisabled?: boolean;
};

export function MediaEditModal({
                                   opened,
                                   onClose,
                                   item,

                                   rating,
                                   onRatingChange,

                                   statusId,
                                   onStatusIdChange,

                                   showDate,
                                   partialDate,
                                   onPartialDateChange,

                                   onOk,
                                   okDisabled,
                               }: MediaEditModalProps) {
    const mediaYear = useMemo(() => {
        const d = item?.releaseDate;
        if (!d) return null;
        const y = Number(String(d).slice(0, 4));
        return Number.isFinite(y) ? y : null;
    }, [item]);

    const headerTitle = item?.title?.trim() || item?.originalTitle?.trim() || "Untitled";

    const headerSub = [
        item?.originalTitle && item.originalTitle !== headerTitle ? item.originalTitle : null,
        mediaYear ? String(mediaYear) : null,
    ]
        .filter(Boolean)
        .join(" • ");

    const [statuses, setStatuses] = useState<StatusDto[]>([]);
    const [statusesLoading, setStatusesLoading] = useState(false);
    const [statusesError, setStatusesError] = useState<string | null>(null);

    const statusCombobox = useCombobox({
        onDropdownClose: () => statusCombobox.resetSelectedOption(),
    });

    useEffect(() => {
        if (!opened) return;

        const controller = new AbortController();

        (async () => {
            try {
                setStatusesLoading(true);
                setStatusesError(null);

                const data = (await getStatuses({ signal: controller.signal })) as StatusDto[];
                setStatuses(data);
            } catch (e: unknown) {
                if (e instanceof DOMException && e.name === "AbortError") return;

                setStatusesError(e instanceof Error ? e.message : "Failed to load statuses");
                setStatuses([]);
            } finally {
                setStatusesLoading(false);
            }
        })();

        return () => controller.abort();
    }, [opened]);

    const itemScope = useMemo(() => resolveScopeByMediaTypeName(item?.mediaType?.name), [item]);

    const filteredStatuses = useMemo(() => {
        if (!itemScope) return statuses.filter((s) => s.scope === "ALL");
        return statuses.filter((s) => s.scope === "ALL" || s.scope === itemScope);
    }, [statuses, itemScope]);

    const selectedStatus = useMemo(
        () => filteredStatuses.find((s) => s.id === statusId) ?? null,
        [filteredStatuses, statusId]
    );

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            radius="lg"
            padding="lg"
            title={
                <Stack gap={2}>
                    <Text fw={800} size="lg">
                        {headerTitle}
                    </Text>
                    {headerSub ? (
                        <Text size="sm" c="dimmed">
                            {headerSub}
                        </Text>
                    ) : null}
                </Stack>
            }
        >
            <Stack gap="md">
                <Flex justify="space-between" align="center">
                    <Text fw={700}>Rating</Text>
                    <RatingPicker value={rating} onChange={onRatingChange} />
                </Flex>

                <Divider />

                <Stack gap={8}>
                    <Text fw={700}>Status</Text>

                    <Combobox
                        store={statusCombobox}
                        withinPortal
                        onOptionSubmit={(value) => {
                            const picked = filteredStatuses.find((s) => String(s.id) === value);
                            if (!picked) return;

                            onStatusIdChange(picked.id);
                            statusCombobox.closeDropdown();
                        }}
                    >
                        <Combobox.Target>
                            <TextInput
                                placeholder={statusesLoading ? "Loading..." : "Choose status"}
                                value={selectedStatus ? selectedStatus.name : ""}
                                readOnly
                                rightSection={statusesLoading ? <Loader size="xs" /> : null}
                                onFocus={() => statusCombobox.openDropdown()}
                                onClick={() => statusCombobox.openDropdown()}
                                error={Boolean(statusesError)}
                            />
                        </Combobox.Target>

                        <Combobox.Dropdown>
                            <Combobox.Options>
                                {statusesError && <Combobox.Empty>{statusesError}</Combobox.Empty>}

                                {!statusesError && !statusesLoading && filteredStatuses.length === 0 && (
                                    <Combobox.Empty>No statuses</Combobox.Empty>
                                )}

                                {!statusesError &&
                                    filteredStatuses.map((s) => (
                                        <Combobox.Option key={s.id} value={String(s.id)}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                <span style={{ fontWeight: 600 }}>{s.name}</span>
                                            </div>
                                        </Combobox.Option>
                                    ))}
                            </Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>
                </Stack>

                {showDate && (
                    <>
                        <Divider />
                        <Stack gap={8}>
                            <Text fw={700}>Date</Text>
                            <PartialDateRow value={partialDate} onChange={onPartialDateChange} />
                        </Stack>
                    </>
                )}

                <Divider />

                <Group justify="flex-end" gap="sm">
                    <Button variant="default" radius="md" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button radius="md" onClick={onOk} disabled={okDisabled || !statusId}>
                        OK
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
