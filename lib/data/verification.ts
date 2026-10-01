import { HELP_ROUTE } from "@/lib/constants";
import type { VerificationState } from "@/lib/types";

export const VERIFICATION_COPY = {
    title: "Business verification",
    continue: "Continue verification",
    respond: "Respond to request",
    support: "Contact support",
    supportHref: HELP_ROUTE,
    requests: "Open requests",
    reference: (reference: string) => `Case reference ${reference}`,
    stale: "Couldn't refresh the verification status. It may be out of date.",
    informational: "Only a workspace owner can respond.",
    states: {
        not_started:
            "Verify your business to open your accounts. It takes about 10 minutes.",
        in_progress:
            "Verification isn't finished. Accounts open once it is submitted and approved.",
        submitted:
            "Verification is submitted and under review. We'll notify you when there is a decision.",
        needs_info:
            "Verification is waiting on information from you. Accounts stay limited until you respond.",
        approved: "Your business is verified.",
        rejected:
            "Verification was not approved, so accounts can't be opened. Contact support and quote the case reference.",
    } satisfies Record<VerificationState, string>,
} as const;
