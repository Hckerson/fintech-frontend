import { HELP_ROUTE } from "@/lib/constants";
import type { VerificationState } from "@/lib/types";

export const VERIFICATION_COPY = {
    title: "Business verification",
    continue: "Continue verification",
    respond: "Respond to request",
    support: "Contact support",
    supportHref: HELP_ROUTE,
    requests: (count: number) =>
        `${count} open ${count === 1 ? "request" : "requests"} from the reviewer`,
    reference: (reference: string) => `Case reference ${reference}`,
    stale: "Couldn't refresh the verification status. It may be out of date.",
    informational: "Only a workspace owner can respond.",
    states: {
        not_started:
            "Verify your business to open accounts. It takes about 10 minutes.",
        in_progress:
            "Verification isn't finished. Accounts open once it is approved.",
        submitted:
            "Verification is under review. We'll notify you of the decision.",
        needs_info:
            "The reviewer needs more information. Accounts stay limited until you respond.",
        approved: "Your business is verified.",
        rejected: "Verification was not approved, so accounts can't be opened.",
    } satisfies Record<VerificationState, string>,
} as const;
