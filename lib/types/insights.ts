import type { routes } from "@/lib/contract/routes";

export type CashFlowRange = Parameters<
    typeof routes.cashFlowSeries
>[0]["range"];
