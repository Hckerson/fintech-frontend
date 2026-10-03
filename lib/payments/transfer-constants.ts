export const TRANSFER_MEMO_MAX = 140;

export const TRANSFER_AMOUNT_MAX_DIGITS = 15;

export const TRANSFER_REVIEW_TTL_MS = 5 * 60 * 1_000;

export const TRANSFER_PER_TRANSFER_LIMIT_MINOR = "5000000";

export const TRANSFER_DAILY_LIMIT_MINOR = "10000000";

export const TRANSFER_CUT_OFF_HOUR = 17;

export const TRANSFER_DESTINATION_KINDS = ["payee", "account"] as const;

export const TRANSFER_ACCOUNT_STATES = ["OPEN", "FROZEN", "CLOSED"] as const;

export const TRANSFER_REFUSALS = [
    "source_unavailable",
    "destination_unavailable",
    "currency_mismatch",
    "insufficient_funds",
    "over_transfer_limit",
    "over_daily_limit",
    "cut_off_passed",
] as const;

export const TRANSFER_KEY_REUSED = "idempotency_key_reused";

export const TRANSFER_REFERENCE_PREFIX = "TRF-";

export const TRANSFER_REFERENCE_LENGTH = 10;

export const OPAQUE_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

export const TRANSFER_SKELETON_ROWS = 4;

export const TRANSFER_REFERENCE_ALPHABET = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
