import type { Figure } from "@/lib/types";

export const TREASURY_COPY = {
    eyebrow: "Treasury",
    title: "See the next ninety days before they happen.",
    lead: "Ledgerline projects your cash from scheduled payments, expected receipts and payroll, then shows how much you can safely put to work.",
    chartTitle: "Cash forecast",
    actualLabel: "Actual",
    forecastLabel: "Forecast",
    bandLabel: "Expected range",
    note: "Illustrative forecast built from sample data.",
} as const;

export const ACTUAL_SERIES: readonly number[] = [
    3.61, 3.66, 3.69, 3.74, 3.8, 3.79, 3.86, 3.9, 3.93, 3.97, 4.02, 4.05, 4.08, 4.12, 4.14, 4.17, 4.22,
];

export const FORECAST_SERIES: readonly number[] = [4.22, 4.19, 4.27, 4.31, 4.28, 4.36, 4.41, 4.38, 4.46, 4.52];

export const FORECAST_SPREAD = 0.12;

export const TREASURY_FIGURES: readonly Figure[] = [
    { id: "runway", value: "31 months", label: "Runway at current burn" },
    { id: "idle", value: "£1.2m", label: "Cash you can safely set aside" },
    { id: "yield", value: "£49k", label: "Projected yearly interest" },
];
