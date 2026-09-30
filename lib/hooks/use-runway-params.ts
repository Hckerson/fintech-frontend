import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { queryString } from "@/lib/utils/query-string";
import { RUNWAY_PARAMS } from "@/lib/insights/constants";

export type RunwayParam = (typeof RUNWAY_PARAMS)[number];
export type RunwayValues = Record<RunwayParam, string>;

export const useRunwayParams = () => {
    const searchParams = useSearchParams();
    const [overrides, setOverrides] = useState<Partial<RunwayValues>>(() =>
        Object.fromEntries(
            RUNWAY_PARAMS.flatMap((key) => {
                const value = searchParams.get(key);
                return value === null ? [] : [[key, value]];
            }),
        ),
    );

    const write = (next: Partial<RunwayValues>) => {
        setOverrides(next);
        window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${queryString(next)}`,
        );
    };

    return {
        overrides,
        set: (key: RunwayParam, value: string) =>
            write({ ...overrides, [key]: value }),
        resetActuals: () =>
            write(overrides.target ? { target: overrides.target } : {}),
    };
};
