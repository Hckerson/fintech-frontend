"use server";
import { z } from "zod";
import { readEnvelope, readStamped } from "@/lib/api-server";
import { routes } from "@/lib/contract/routes";
import {
    accountResponseDtoSchema,
    cashFlowSeriesResponseDtoSchema,
} from "@/lib/contract/schemas";
import { TREND_RANGE } from "@/lib/dashboard/constants";
import type { ActionResult, CashPosition } from "@/lib/types";
import { heldCurrencies } from "@/lib/utils/account-list";
import { cashPositions } from "@/lib/utils/cash-position";

export const getCashPosition = async (): Promise<
    ActionResult<CashPosition[]>
> => {
    const accounts = await readStamped(
        routes.accountsFindAll(),
        z.array(accountResponseDtoSchema),
    );
    if (!accounts.ok) return accounts;

    const series = await Promise.all(
        heldCurrencies(accounts.data.data).map(async (currency) => {
            const flow = await readEnvelope(
                routes.cashFlowSeries({ range: TREND_RANGE, currency }),
                cashFlowSeriesResponseDtoSchema,
            );
            return flow.ok ? flow.data : null;
        }),
    );

    return {
        ok: true,
        data: cashPositions(accounts.data.data, series, accounts.data.asOf),
    };
};
