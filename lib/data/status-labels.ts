import type { Account, ExportJob, Transaction } from "@/lib/types";
import type { StatusCopy, VerificationState } from "@/lib/types";

export const UNKNOWN_STATUS: StatusCopy = {
    label: "Unknown status",
    severity: "neutral",
};

export const ACCOUNT_STATE_LABELS: Record<Account["state"], StatusCopy> = {
    OPEN: { label: "Active", severity: "positive" },
    FROZEN: { label: "Frozen", severity: "attention" },
    CLOSED: { label: "Closed", severity: "neutral" },
};

export const TRANSACTION_STATUS_LABELS: Record<
    Transaction["status"],
    StatusCopy
> = {
    pending: { label: "Pending", severity: "attention" },
    posted: { label: "Posted", severity: "neutral" },
    returned: { label: "Returned", severity: "problem" },
    reversed: { label: "Reversed", severity: "neutral" },
    failed: { label: "Failed", severity: "problem" },
};

export const VERIFICATION_STATE_LABELS: Record<VerificationState, StatusCopy> =
    {
        not_started: { label: "Not started", severity: "neutral" },
        in_progress: { label: "In progress", severity: "neutral" },
        submitted: { label: "Submitted", severity: "information" },
        needs_info: { label: "Needs info", severity: "attention" },
        approved: { label: "Approved", severity: "positive" },
        rejected: { label: "Rejected", severity: "problem" },
    };

export const EXPORT_STATE_LABELS: Record<ExportJob["state"], StatusCopy> = {
    queued: { label: "Queued", severity: "neutral" },
    running: { label: "Preparing", severity: "information" },
    ready: { label: "Ready", severity: "positive" },
    failed: { label: "Failed", severity: "problem" },
    expired: { label: "Expired", severity: "neutral" },
};
