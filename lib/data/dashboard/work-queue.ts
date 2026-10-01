import type { ExportJob, InfoRequest } from "@/lib/types";

export const EXPORTS_SEED: readonly ExportJob[] = [
    {
        id: "exp_seed_01",
        label: "Operating account, September 2026 (CSV)",
        state: "ready",
        updatedAt: "2026-10-01T06:20:00.000Z",
    },
    {
        id: "exp_seed_02",
        label: "All accounts, Q3 2026 (CSV)",
        state: "failed",
        updatedAt: "2026-09-30T18:05:00.000Z",
    },
    {
        id: "exp_seed_03",
        label: "Payroll account, August 2026 (CSV)",
        state: "expired",
        updatedAt: "2026-09-08T10:00:00.000Z",
    },
];

export const CASE_REFERENCE_SEED = "VC-4Q7K2M";

export const INFO_REQUESTS_SEED: readonly InfoRequest[] = [
    {
        id: "req_seed_01",
        message:
            "The proof of address for the registered office is older than three months. Upload a more recent one.",
        fieldRef: "documents",
        createdAt: "2026-09-28T10:30:00.000Z",
    },
    {
        id: "req_seed_02",
        message:
            "Confirm the ownership percentage for the second beneficial owner.",
        fieldRef: "owners",
        createdAt: "2026-09-29T14:12:00.000Z",
    },
];
