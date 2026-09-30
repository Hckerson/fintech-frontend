const ZERO = BigInt(0);

export interface RunwayInput {
    cashMinor: bigint;
    monthlyBurnMinor: bigint;
    monthlyInflowMinor: bigint;
}

export interface RunwayPoint {
    month: Date;
    balanceMinor: bigint;
}

export interface RunwayResult {
    months: number | null;
    runsOutOn: Date | null;
    series: RunwayPoint[];
}

const addMonths = (date: Date, months: number) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + months;
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return new Date(
        Date.UTC(year, month, Math.min(date.getUTCDate(), lastDay)),
    );
};

const daysBetween = (start: Date, end: Date) =>
    Math.round((end.getTime() - start.getTime()) / 86_400_000);

export const runway = (
    { cashMinor, monthlyBurnMinor, monthlyInflowMinor }: RunwayInput,
    from: Date,
    horizonMonths: number,
): RunwayResult => {
    const cash = cashMinor > ZERO ? cashMinor : ZERO;
    const netBurn = monthlyBurnMinor - monthlyInflowMinor;
    const burning = netBurn > ZERO;
    const months = burning ? Number(cash / netBurn) : null;
    const length =
        months === null ? horizonMonths : Math.min(months + 1, horizonMonths);
    const series = Array.from({ length: length + 1 }, (_, index) => {
        const balance = cash - netBurn * BigInt(index);
        return {
            month: addMonths(from, index),
            balanceMinor: balance > ZERO ? balance : ZERO,
        };
    });

    if (months === null) return { months, runsOutOn: null, series };
    const lastFull = addMonths(from, months);
    if (Number.isNaN(lastFull.getTime()))
        return { months, runsOutOn: null, series };

    const partialDays = Number(
        ((cash % netBurn) *
            BigInt(daysBetween(lastFull, addMonths(from, months + 1)))) /
            netBurn,
    );
    const runsOutOn = new Date(lastFull.getTime() + partialDays * 86_400_000);
    return { months, runsOutOn, series };
};
