import { DEFAULT_LOCALE } from "@/lib/constants";
import type {
    PayeeQuery,
    PayeeSort,
    PayeeSummary,
    StoredPayee,
} from "@/lib/types";

const collator = new Intl.Collator(DEFAULT_LOCALE, { sensitivity: "base" });

const fold = (text: string) => text.toLocaleLowerCase(DEFAULT_LOCALE);

const byName = (a: StoredPayee, b: StoredPayee) =>
    collator.compare(a.name, b.name) || a.id.localeCompare(b.id);

const byLastPaid = (a: StoredPayee, b: StoredPayee) =>
    (a.lastPaidAt ?? "").localeCompare(b.lastPaidAt ?? "") || byName(a, b);

const ORDER: Record<PayeeSort, (a: StoredPayee, b: StoredPayee) => number> = {
    name_asc: byName,
    name_desc: (a, b) => byName(b, a),
    last_paid_asc: byLastPaid,
    last_paid_desc: (a, b) => byLastPaid(b, a),
};

export const matchPayees = (
    payees: readonly StoredPayee[],
    { search, status, sort }: Pick<PayeeQuery, "search" | "status" | "sort">,
): StoredPayee[] =>
    payees
        .filter(
            (payee) =>
                fold(payee.name).includes(fold(search)) &&
                (status === "all" || payee.status === status),
        )
        .sort(ORDER[sort]);

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
