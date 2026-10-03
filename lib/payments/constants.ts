export const PAYEE_PAGE_SIZE = 50;

export const PAYEE_SKELETON_ROWS = 5;

export const PAYEE_PANE_QUERY = "(min-width: 80rem)";

export const PAYEE_ACTIVITY_SKELETON_ROWS = 3;

export const PAYEE_NAME_MAX = 100;

export const PAYEE_SEARCH_MAX = 100;

export const SORT_CODE_LENGTH = 6;

export const ACCOUNT_NUMBER_LENGTH = 8;

export const DESTINATION_VISIBLE_DIGITS = 4;

export const PAYEE_STATUSES = ["active", "pending_verification"] as const;

export const PAYEE_FILTERS = ["all", ...PAYEE_STATUSES] as const;

export const PAYEE_SORTS = [
    "name_asc",
    "name_desc",
    "last_paid_desc",
    "last_paid_asc",
] as const;

export const PAYEE_PAYMENT_STATUSES = ["settled", "pending"] as const;

export const STEP_UP_PURPOSES = [
    "payee_add",
    "payee_rename",
    "payee_remove",
    "transfer",
    "account_reveal",
] as const;

export const PAYEE_REFUSAL = {
    duplicate: "payee_duplicate",
    paymentInProgress: "payment_in_progress",
    keyReused: "idempotency_key_reused",
} as const;

export const PAYEE_FIELDS = ["name", "sortCode", "accountNumber"] as const;

export const MINOR_UNITS_PATTERN = /^\d{1,18}$/;

export const IDEMPOTENCY_WINDOW_MS = 24 * 60 * 60 * 1_000;

export const STEP_UP_GRANT_SECONDS = 5 * 60;

export const STEP_UP_MAX_ATTEMPTS = 5;

export const STEP_UP_LOCK_SECONDS = 15 * 60;

export const STEP_UP_REJECTED = "step_up_rejected";
