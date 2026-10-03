"use server";
import { readEnvelope } from "@/lib/api-server";
import {
    DEFAULT_CURRENCY,
    HTTP_STATUS,
    INVALID_REQUEST,
} from "@/lib/constants";
import { routes } from "@/lib/contract/routes";
import { cashFlowSeriesResponseDtoSchema } from "@/lib/contract/schemas";
import type { ActionResult, CashFlowQuery, CashFlowSeries } from "@/lib/types";
import { seedCashFlow } from "@/lib/utils/seed-cash-flow";
import { serverEnv } from "@/lib/utils/server-env";
import { standIn } from "@/lib/utils/stand-in";
import { cashFlowQuerySchema } from "@/lib/validations/dashboard";

export const getCashFlow = async (
    query: CashFlowQuery,
): Promise<ActionResult<CashFlowSeries>> => {
    const parsed = cashFlowQuerySchema.safeParse(query);
    if (!parsed.success) {
        return {
            ok: false,
            status: HTTP_STATUS.badRequest,
            message: INVALID_REQUEST,
        };
    }

    const { range, currency = DEFAULT_CURRENCY } = parsed.data;
    return serverEnv.liveData
        ? readEnvelope(
              routes.cashFlowSeries(parsed.data),
              cashFlowSeriesResponseDtoSchema,
          )
        : standIn(cashFlowSeriesResponseDtoSchema, () =>
              seedCashFlow({ range, currency }, new Date()),
          );
};
