import type {
    AccountResponseDto,
    CashFlowSeriesResponseDto,
} from "@/lib/contract/schemas";
import { RUNWAY_MIN_HISTORY_MONTHS } from "@/lib/insights/constants";

export interface RunwayDefaults {
    currency: string;
    cashMinor: bigint;
    burnMinor: bigint | null;
    inflowMinor: bigint | null;
}

const monthsBetween = (start: Date, end: Date) =>
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    end.getUTCMonth() -
    start.getUTCMonth();

const average = (values: string[]) =>
    values.reduce((sum, value) => sum + BigInt(value), BigInt(0)) /
    BigInt(values.length);

export const runwayDefaults = (
    accounts: AccountResponseDto[],
    cashFlow: CashFlowSeriesResponseDto,
    now: Date,
): RunwayDefaults => {
    const open = accounts.filter(
        (account) =>
            account.currency === cashFlow.currency && account.state === "OPEN",
    );
    const cashMinor = open.reduce(
        (sum, account) => sum + BigInt(account.available.amountMinor),
        BigInt(0),
    );
    const oldest = Math.min(
        ...open.map((account) => Date.parse(account.openedAt)),
    );
    const enoughHistory =
        open.length > 0 &&
        monthsBetween(new Date(oldest), now) >= RUNWAY_MIN_HISTORY_MONTHS;
    const fullMonths = cashFlow.points.slice(
        -RUNWAY_MIN_HISTORY_MONTHS - 1,
        -1,
    );

    return {
        currency: cashFlow.currency,
        cashMinor,
        burnMinor: enoughHistory
            ? average(fullMonths.map((point) => point.outflow.amountMinor))
            : null,
        inflowMinor: enoughHistory
            ? average(fullMonths.map((point) => point.inflow.amountMinor))
            : null,
    };
};
