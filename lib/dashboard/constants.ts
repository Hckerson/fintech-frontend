import type { CashFlowRange } from "@/lib/types/insights";

export const DASHBOARD_ACCOUNT_LIMIT = 6;

export const DASHBOARD_ACTIVITY_LIMIT = 8;

export const DASHBOARD_PENDING_LIMIT = 10;

export const DEFAULT_CASH_FLOW_RANGE: CashFlowRange = "30d";

export const TREND_RANGE: CashFlowRange = "30d";

export const TREND_DAYS = 30;

export const TREND_PERCENT_CEILING = 9.99;

export const SPARKLINE = { width: 160, height: 40, pad: 4 } as const;

export const CLOSED_ACCOUNT_STATE = "CLOSED";

export const FROZEN_ACCOUNT_STATE = "FROZEN";

export const DASHBOARD_PARAMS = ["range", "currency"] as const;
