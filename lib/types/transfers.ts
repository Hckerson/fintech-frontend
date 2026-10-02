import type { z } from "zod";
import type {
    TRANSFER_DESTINATION_KINDS,
    TRANSFER_REFUSALS,
} from "@/lib/payments/transfer-constants";
import type {
    transferAccountSchema,
    transferInputSchema,
    transferOptionsSchema,
    transferSchema,
} from "@/lib/validations/transfers";

export type TransferInput = z.infer<typeof transferInputSchema>;

export type TransferAccount = z.infer<typeof transferAccountSchema>;

export type TransferOptions = z.infer<typeof transferOptionsSchema>;

export type Transfer = z.infer<typeof transferSchema>;

export type TransferParty = Transfer["to"];

export type TransferRefusal = (typeof TRANSFER_REFUSALS)[number];

export type TransferDestinationKind =
    (typeof TRANSFER_DESTINATION_KINDS)[number];

export type TransferStep = "edit" | "review" | "done";

export interface TransferDraft {
    fromAccountId: string;
    kind: TransferDestinationKind;
    payeeId: string;
    accountId: string;
    amount: string;
    memo: string;
}

export type TransferField = "from" | "to" | "amount" | "memo";

export type TransferIssue = TransferRefusal | "required" | "amount" | "memo";

export interface TransferReview {
    input: Omit<TransferInput, "idempotencyKey">;
    from: TransferAccount;
    to: TransferParty;
}

export interface TransferCheck {
    issues: Partial<Record<TransferField, TransferIssue>>;
    review: TransferReview | null;
}
