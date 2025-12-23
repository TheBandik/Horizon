import { Group, UnstyledButton } from "@mantine/core";

type RatingPickerProps = {
    value: number | null;
    onChange: (v: number) => void;
};

export function RatingPicker({ value, onChange }: RatingPickerProps) {
    return (
        <Group gap={6}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                const active = value === n;

                return (
                    <UnstyledButton
                        key={n}
                        onClick={() => onChange(n)}
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border: active
                                ? "2px solid var(--mantine-color-accent-4)"
                                : "1px solid var(--mantine-color-gray-4)",
                            background: active ? "var(--mantine-color-accent-4)" : "transparent",
                            color: active
                                ? "var(--mantine-color-white)"
                                : "var(--mantine-color-text)",
                            fontWeight: 700,
                            fontSize: 13,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "120ms ease",
                        }}
                        aria-label={`Rating ${n}`}
                    >
                        {n}
                    </UnstyledButton>
                );
            })}
        </Group>
    );
}
