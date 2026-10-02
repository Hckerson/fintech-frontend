import { DEFAULT_LOCALE } from "@/lib/constants";
import type { PayeeQuery, PayeeSummary, StoredPayee } from "@/lib/types";

const collator = new Intl.Collator(DEFAULT_LOCALE, { sensitivity: "base" });

const fold = (text: string) => text.toLocaleLowerCase(DEFAULT_LOCALE);

export const matchPayees = (
    payees: readonly StoredPayee[],
    { search, status }: Pick<PayeeQuery, "search" | "status">,
): StoredPayee[] =>
    payees
        .filter(
            (payee) =>
                fold(payee.name).includes(fold(search)) &&
                (status === "all" || payee.status === status),
        )
        .sort(
            (a, b) =>
                collator.compare(a.name, b.name) || a.id.localeCompare(b.id),
        );

export const summarisePayees = (
    payees: readonly StoredPayee[],
): PayeeSummary => {
    const tally = (test: (payee: StoredPayee) => boolean) =>
        payees.filter(test).length;

    return {
        total: payees.length,
        active: tally((payee) => payee.status === "active"),
        pendingVerification: tally(
            (payee) => payee.status === "pending_verification",
        ),
        inProgress: tally((payee) => payee.paymentInProgress),
    };
};
