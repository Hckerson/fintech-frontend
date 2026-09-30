"use server";
import { readEnvelope } from "@/lib/api-server";
import { routes } from "@/lib/contract/routes";
import { cashFlowSeriesResponseDtoSchema } from "@/lib/contract/schemas";
import type { CashFlowRange } from "@/lib/types";

export const getCashFlow = async (range: CashFlowRange) =>
    readEnvelope(
        routes.cashFlowSeries({ range }),
        cashFlowSeriesResponseDtoSchema,
    );
