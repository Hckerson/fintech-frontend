export const VERIFICATION_STATES = [
    "not_started",
    "in_progress",
    "submitted",
    "needs_info",
    "approved",
    "rejected",
] as const;

export const TRANSACTION_STATUSES = [
    "pending",
    "posted",
    "returned",
    "reversed",
    "failed",
] as const;

export const EXPORT_STATES = [
    "queued",
    "running",
    "ready",
    "failed",
    "expired",
] as const;

export const SEVERITIES = [
    "neutral",
    "positive",
    "attention",
    "problem",
    "information",
] as const;
