export type ResetLinkState = "valid" | "invalid" | "unavailable";

export type VerifyMethod = "code" | "recovery";

export interface VerifyResult {
    recoveryCodesRemaining?: number;
}
