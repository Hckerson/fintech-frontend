"use server";
import { readEnvelope } from "@/lib/api-server";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import { routes } from "@/lib/contract/routes";
import { cashFlowSeriesResponseDtoSchema } from "@/lib/contract/schemas";
import type { ActionResult, CashFlowQuery, CashFlowSeries } from "@/lib/types";
import { cashFlowQuerySchema } from "@/lib/validations/dashboard";

export const getCashFlow = async (
    query: CashFlowQuery,
): Promise<ActionResult<CashFlowSeries>> => {
    const parsed = cashFlowQuerySchema.safeParse(query);
    return parsed.success
        ? readEnvelope(
              routes.cashFlowSeries(parsed.data),
              cashFlowSeriesResponseDtoSchema,
          )
        : {
              ok: false,
              status: HTTP_STATUS.badRequest,
              message: INVALID_REQUEST,
          };
};
