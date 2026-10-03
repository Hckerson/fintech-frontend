import type { z } from "zod";
import type {
    AccountResponseDto,
    CashFlowSeriesResponseDto,
    MoneyDto,
} from "@/lib/contract/schemas";
import type {
    DASHBOARD_PARAMS,
    DASHBOARD_VIEWS,
} from "@/lib/dashboard/constants";
import type {
    accountListSchema,
    cashFlowQuerySchema,
    cashPositionSchema,
    dashboardSearchParamsSchema,
    exportJobSchema,
    infoRequestSchema,
    pendingGroupSchema,
    transactionListSchema,
    transactionQuerySchema,
    transactionSchema,
    verificationCaseSchema,
} from "@/lib/validations/dashboard";
import type { Severity } from "./workspace";

export type Money = MoneyDto;

export type Account = AccountResponseDto;

export type AccountList = z.infer<typeof accountListSchema>;

export type CashPosition = z.infer<typeof cashPositionSchema>;

export type CashFlowSeries = CashFlowSeriesResponseDto;

export type CashFlowQuery = z.infer<typeof cashFlowQuerySchema>;

export type Transaction = z.infer<typeof transactionSchema>;

export type TransactionList = z.infer<typeof transactionListSchema>;

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;

export type PendingGroup = z.infer<typeof pendingGroupSchema>;

export type ExportJob = z.infer<typeof exportJobSchema>;

export type InfoRequest = z.infer<typeof infoRequestSchema>;

export type VerificationCase = z.infer<typeof verificationCaseSchema>;

export type DashboardParams = z.infer<typeof dashboardSearchParamsSchema> & {
    dropped: (typeof DASHBOARD_PARAMS)[number][];
};

export type DashboardSectionKey =
    | "verification"
    | "verificationNotice"
    | "cashPosition"
    | "accountSummary"
    | "recentActivity"
    | "pendingItems"
    | "cashFlow";

export type PendingItemKind =
    | "pending_transactions"
    | "export_ready"
    | "export_failed"
    | "verification_request";

export interface PendingItem {
    id: string;
    kind: PendingItemKind;
    title: string;
    detail: string;
    amount?: Money;
    href: string | null;
    severity: Severity;
    at: string;
}

export type PendingSource = "transactions" | "exports" | "verification";

export interface Trend {
    direction: "up" | "down" | "flat";
    ratio: number | null;
}

export interface DashboardLayout {
    notice: readonly DashboardSectionKey[];
    main: readonly DashboardSectionKey[];
    side: readonly DashboardSectionKey[];
    below: readonly DashboardSectionKey[];
}

export type DashboardView = (typeof DASHBOARD_VIEWS)[number];

export interface ActivityDay {
    date: string;
    label: string;
    items: Transaction[];
}
