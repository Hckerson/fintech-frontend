import type { z } from "zod";
import type {
    PAYEE_FIELDS,
    PAYEE_FILTERS,
    PAYEE_SORTS,
    STEP_UP_PURPOSES,
} from "@/lib/payments/constants";
import type { ActionError } from "@/lib/utils/action-error";
import type {
    payeeActivitySchema,
    payeeCreateSchema,
    payeeInputSchema,
    payeePageSchema,
    payeeQuerySchema,
    payeeRenameSchema,
    payeeSchema,
    payeeVersionSchema,
    stepUpSchema,
} from "@/lib/validations/payees";

export type Payee = z.infer<typeof payeeSchema>;

export type StoredPayee = Payee & { destination: string };

export type PayeePage = z.infer<typeof payeePageSchema>;

export type PayeeQuery = z.infer<typeof payeeQuerySchema>;

export type PayeeInput = z.input<typeof payeeInputSchema>;

export type PayeeCreate = z.input<typeof payeeCreateSchema>;

export type PayeeVersion = z.infer<typeof payeeVersionSchema>;

export type PayeeRename = z.infer<typeof payeeRenameSchema>;

export type StepUpPurpose = (typeof STEP_UP_PURPOSES)[number];

export type StepUpRequest = z.infer<typeof stepUpSchema>;

export type PayeeSort = (typeof PAYEE_SORTS)[number];

export type PayeeActivity = z.infer<typeof payeeActivitySchema>;

export type PayeePayment = PayeeActivity["items"][number];

export type PayeeFilter = (typeof PAYEE_FILTERS)[number];

export type PayeeSummary = PayeePage["summary"];

export type PayeeTarget =
    | { kind: "add" }
    | { kind: "rename" | "remove"; payee: Payee };

export type PayeeField = (typeof PAYEE_FIELDS)[number];

export interface ProtectedWrite {
    pending: boolean;
    asking: boolean;
    notice: string | null;
    error: ActionError | null;
    reset: () => void;
    settle: (granted: boolean) => void;
}
