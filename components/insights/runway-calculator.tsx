"use client";
import { useMemo, useState } from "react";
import RunwayInputs from "@/components/insights/runway-inputs";
import RunwayResult from "@/components/insights/runway-result";
import RunwayProjection from "@/components/insights/runway-projection";
import { useAccounts } from "@/lib/hooks/use-accounts";
import { useCashFlow } from "@/lib/hooks/use-cash-flow";
import { useSettled } from "@/lib/hooks/use-settled";
import {
    useRunwayParams,
    type RunwayParam,
    type RunwayValues,
} from "@/lib/hooks/use-runway-params";
import { runwayDefaults } from "@/lib/insights/runway-defaults";
import { runwayOutlook } from "@/lib/insights/runway-outlook";
import {
    RUNWAY_DEFAULT_TARGET_MONTHS,
    RUNWAY_HORIZON_MONTHS,
    RUNWAY_PARAMS,
    RUNWAY_SETTLE_MS,
} from "@/lib/insights/constants";
import { RUNWAY_COPY } from "@/lib/data/insights/runway";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import {
    formatMoney,
    fractionDigits,
    toMajor,
    toMinor,
} from "@/lib/utils/money";
import { runway } from "@/lib/utils/runway";
import { queryString } from "@/lib/utils/query-string";

const MONEY_PARAMS = ["cash", "burn", "inflow"] as const;

export default function RunwayCalculator() {
    const accounts = useAccounts();
    const cashFlow = useCashFlow("12m");
    const { overrides, set, resetActuals } = useRunwayParams();
    const [copied, setCopied] = useState(false);

    const defaults = useMemo(
        () =>
            accounts.data && cashFlow.data
                ? runwayDefaults(accounts.data, cashFlow.data, new Date())
                : null,
        [accounts.data, cashFlow.data],
    );
    const currency = defaults?.currency ?? DEFAULT_CURRENCY;
    const digits = fractionDigits(currency);
    const major = (minor: bigint | null | undefined) =>
        minor == null ? "" : toMajor(minor, digits);
    const actual: RunwayValues = {
        cash: major(defaults?.cashMinor),
        burn: major(defaults?.burnMinor),
        inflow: major(defaults?.inflowMinor),
        target: String(RUNWAY_DEFAULT_TARGET_MONTHS),
    };
    const values = Object.fromEntries(
        RUNWAY_PARAMS.map((key) => [key, overrides[key] ?? actual[key]]),
    ) as RunwayValues;

    const minor = (key: RunwayParam) => toMinor(values[key], digits);
    const errors = Object.fromEntries(
        MONEY_PARAMS.filter(
            (key) => values[key] !== "" && minor(key) === null,
        ).map((key) => [key, RUNWAY_COPY.invalid]),
    );
    const target =
        Number.parseInt(values.target, 10) || RUNWAY_DEFAULT_TARGET_MONTHS;
    const input = {
        cashMinor: minor("cash") ?? BigInt(0),
        monthlyBurnMinor: minor("burn") ?? BigInt(0),
        monthlyInflowMinor: minor("inflow") ?? BigInt(0),
    };
    const ready = values.cash !== "" && values.burn !== "";
    const result = ready
        ? runway(input, new Date(), RUNWAY_HORIZON_MONTHS)
        : null;

    const money = (amount: bigint) =>
        formatMoney(amount.toString(), currency) ?? "";
    const outlook = runwayOutlook(result);
    const headline =
        result?.months == null ? "" : `${RUNWAY_COPY.months(result.months)}. `;
    const announcement = useSettled(`${headline}${outlook}`, RUNWAY_SETTLE_MS);

    const status =
        accounts.isPending || cashFlow.isPending
            ? RUNWAY_COPY.loading
            : accounts.isError || cashFlow.isError
              ? RUNWAY_COPY.loadFailed
              : defaults?.burnMinor === null
                ? RUNWAY_COPY.shortHistory
                : null;

    const copyLink = async () => {
        const { origin, pathname } = window.location;
        await navigator.clipboard.writeText(
            `${origin}${pathname}${queryString(values)}`,
        );
        setCopied(true);
    };

    return (
        <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
            <RunwayInputs
                values={values}
                errors={errors}
                currency={currency}
                status={status}
                copied={copied}
                onChange={(key, value) => {
                    set(key, value);
                    setCopied(false);
                }}
                onReset={resetActuals}
                onCopy={copyLink}
            />
            <div className="order-first flex flex-col gap-3 lg:order-none">
                <RunwayResult
                    result={result}
                    target={target}
                    outlook={outlook}
                    assumptions={RUNWAY_COPY.assumptions(
                        money(input.cashMinor),
                        money(input.monthlyBurnMinor),
                        money(input.monthlyInflowMinor),
                    )}
                    announcement={announcement}
                />
                {result ? (
                    <RunwayProjection
                        series={result.series}
                        currency={currency}
                        target={target}
                    />
                ) : null}
            </div>
        </div>
    );
}
