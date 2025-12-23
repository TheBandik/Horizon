import { Text, TextInput } from "@mantine/core";
import { forwardRef } from "react";

export type DatePart = "DAY" | "MONTH" | "YEAR";

type DateCardProps = {
    label: DatePart;
    value: string;
    onChange: (v: string) => void;
    onBlurPad?: () => void;

    placeholder: string;
    maxLength: number;

    error?: string | null;

    onKeyDownNext?: () => void;
};

export const DateCard = forwardRef<HTMLInputElement, DateCardProps>(function DateCard(
    {
        label,
        value,
        onChange,
        onBlurPad,
        placeholder,
        maxLength,
        error,
        onKeyDownNext,
    },
    ref
) {
    return (
        <div
            style={{
                flex: 1,
                padding: 12,
                borderRadius: 14,
                border: error
                    ? "1px solid var(--mantine-color-red-6)"
                    : "1px solid var(--mantine-color-gray-4)",
                background: "var(--mantine-color-body)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
            }}
        >
            <Text size="xs" c={error ? "red" : "dimmed"} fw={700} style={{ letterSpacing: 0.6 }}>
                {label}
            </Text>

            <TextInput
                ref={ref}
                size="sm"
                radius="md"
                value={value}
                placeholder={placeholder}
                maxLength={maxLength}
                error={error ?? undefined}
                onChange={(e) => {
                    const digits = e.currentTarget.value.replace(/\D/g, "");
                    onChange(digits);
                }}
                onBlur={() => onBlurPad?.()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "ArrowRight") {
                        e.preventDefault();
                        onKeyDownNext?.();
                    }
                }}
                styles={{
                    input: { textAlign: "center", fontWeight: 700, letterSpacing: 1 },
                }}
            />
        </div>
    );
});
