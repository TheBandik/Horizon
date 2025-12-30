import type { ComponentType } from "react";
import type { DatePrecision } from "../../api/mediaUser";

export type PartialDateValue = { day: string; month: string; year: string };

export type MediaNavItem = {
    id: string;
    link: string;
    label: string;
    icon: ComponentType<{ className?: string; stroke?: number; size?: number }>;
    disabled?: boolean;
    code?: string;
};

export type EventDatePayload = {
    eventDate: string | null;
    precision: DatePrecision | null;
};
