import { Group, Text } from "@mantine/core";
import { useMemo, useRef } from "react";
import { DateCard } from "./DateCard";

export type PartialDateValue = {
    day: string;   // "" либо "01".."31"
    month: string; // "" либо "01".."12"
    year: string;  // "" либо "2025"
};

type Props = {
    value: PartialDateValue;
    onChange: (next: PartialDateValue) => void;
};

function toInt(v: string) {
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function pad2(v: string) {
    if (!v) return "";
    return v.padStart(2, "0").slice(0, 2);
}

function pad4(v: string) {
    if (!v) return "";
    return v.padStart(4, "0").slice(0, 4);
}

function clampToRange(raw: string, min: number, max: number, pad: (s: string) => string) {
    if (!raw) return "";
    const n = toInt(raw);
    if (n === null) return "";
    if (n < min || n > max) return raw;
    return pad(String(n));
}

export function PartialDateRow({ value, onChange }: Props) {
    const dayRef = useRef<HTMLInputElement | null>(null);
    const monthRef = useRef<HTMLInputElement | null>(null);
    const yearRef = useRef<HTMLInputElement | null>(null);

    const errors = useMemo(() => {
        const d = toInt(value.day);
        const m = toInt(value.month);
        const y = toInt(value.year);

        const dayErr =
            value.day && (d === null || d < 1 || d > 31) ? "1–31" : null;

        const monthErr =
            value.month && (m === null || m < 1 || m > 12) ? "1–12" : null;

        const yearErr =
            value.year && (y === null || y < 1 || y > 9999) ? "1–9999" : null;

        const yearMissingHint =
            !value.year && (value.month || value.day)
                ? "Для частичной даты нужен год"
                : null;

        return { dayErr, monthErr, yearErr, yearMissingHint };
    }, [value.day, value.month, value.year]);

    const set = (patch: Partial<PartialDateValue>) => onChange({ ...value, ...patch });

    return (
        <>
            <Group gap={10} align="stretch" wrap="nowrap">
                <DateCard
                    ref={dayRef}
                    label="DAY"
                    value={value.day}
                    onChange={(v) => set({ day: v })}
                    placeholder="DD"
                    maxLength={2}
                    error={errors.dayErr}
                    onBlurPad={() => set({ day: clampToRange(value.day, 1, 31, pad2) })}
                    onKeyDownNext={() => monthRef.current?.focus()}
                />

                <DateCard
                    ref={monthRef}
                    label="MONTH"
                    value={value.month}
                    onChange={(v) => set({ month: v })}
                    placeholder="MM"
                    maxLength={2}
                    error={errors.monthErr}
                    onBlurPad={() => set({ month: clampToRange(value.month, 1, 12, pad2) })}
                    onKeyDownNext={() => yearRef.current?.focus()}
                />

                <DateCard
                    ref={yearRef}
                    label="YEAR"
                    value={value.year}
                    onChange={(v) => set({ year: v })}
                    placeholder="YYYY"
                    maxLength={4}
                    error={errors.yearErr}
                    onBlurPad={() => set({ year: pad4(value.year) })}
                    onKeyDownNext={() => yearRef.current?.blur()}
                />
            </Group>

            {errors.yearMissingHint ? (
                <Text size="xs" c="dimmed" mt={8}>
                    {errors.yearMissingHint}
                </Text>
            ) : null}
        </>
    );
}
