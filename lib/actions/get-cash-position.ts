"use server";
import { z } from "zod";
import { readEnvelope, readStamped } from "@/lib/api-server";
import { routes } from "@/lib/contract/routes";
import {
    accountResponseDtoSchema,
    cashFlowSeriesResponseDtoSchema,
} from "@/lib/contract/schemas";
import { TREND_RANGE } from "@/lib/dashboard/constants";
import { ACCOUNTS_SEED } from "@/lib/data/ledger/accounts";
import type { ActionResult, CashPosition } from "@/lib/types";
import { heldCurrencies } from "@/lib/utils/account-list";
import { cashPositions } from "@/lib/utils/cash-position";
import { seedCashFlow } from "@/lib/utils/seed-cash-flow";
import { serverEnv } from "@/lib/utils/server-env";
import { standIn } from "@/lib/utils/stand-in";
import { cashPositionSchema } from "@/lib/validations/dashboard";

const live = async (): Promise<ActionResult<CashPosition[]>> => {
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

export const getCashPosition = async (): Promise<
    ActionResult<CashPosition[]>
> =>
    serverEnv.liveData
        ? live()
        : standIn(z.array(cashPositionSchema), () => {
              const today = new Date();
              return cashPositions(
                  ACCOUNTS_SEED,
                  heldCurrencies(ACCOUNTS_SEED).map((currency) =>
                      seedCashFlow({ range: TREND_RANGE, currency }, today),
                  ),
                  today.toISOString(),
              );
          });
