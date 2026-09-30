export const RUNWAY_COPY = {
    eyebrow: "Insights",
    title: "Runway",
    lead: "How long your cash lasts at the pace you're spending it.",
    estimate: "Estimate",
    disclaimer:
        "An estimate from the figures you see here, not a bank forecast.",
    fields: {
        cash: {
            label: "Cash on hand",
            hint: "Available balance across your open accounts.",
        },
        burn: {
            label: "Monthly spending",
            hint: "Average money out over the last 3 full months.",
        },
        inflow: {
            label: "Monthly money in",
            hint: "Average money in over the last 3 full months.",
        },
        target: {
            label: "Target runway",
            hint: "How many months you want covered.",
        },
    },
    invalid: "Enter an amount, like 12500 or 12500.50.",
    months: (count: number) =>
        `${count.toLocaleString()} ${count === 1 ? "month" : "months"}`,
    runsOut: (date: string) => `Cash runs out around ${date}.`,
    tooFar: "Further out than a date can show.",
    notBurning: "Your inflow covers your spending at these figures.",
    notRunningOut: "Not running out",
    awaiting: "Enter your cash and monthly spending to see an estimate.",
    assumptions: (cash: string, burn: string, inflow: string) =>
        `Assumes ${cash} in cash, ${burn} going out and ${inflow} coming in every month, with nothing else changing.`,
    loading: "Loading your figures. You can type while you wait.",
    loadFailed: "Couldn't load your balances. Enter figures to estimate.",
    shortHistory:
        "There's less than 3 months of history, so there are no averages yet. Enter figures to estimate.",
    reset: "Reset to actuals",
    copyLink: "Copy link",
    copied: "Link copied",
    meter: "Runway against target",
    meterValue: (months: number, target: number) =>
        `${months} of ${target} months`,
    chartTitle: "Projected cash",
    chartSummary: (start: string, end: string, months: number) =>
        `Projected cash goes from ${start} to ${end} over ${months} months.`,
    targetMarker: "Target",
    table: { month: "Month", balance: "Projected cash" },
    showTable: "Show as table",
    metaTitle: "Runway · Ledgerline",
} as const;
