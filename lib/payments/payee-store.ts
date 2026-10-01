import "server-only";
import { nanoid } from "nanoid";
import { DEFAULT_LOCALE, HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { SEED_PAYEES } from "@/lib/data/payments/payees";
import {
    DESTINATION_VISIBLE_DIGITS,
    IDEMPOTENCY_WINDOW_MS,
    PAYEE_PAGE_SIZE,
    PAYEE_REFUSAL,
} from "@/lib/payments/constants";
import type {
    ActionFailure,
    ActionResult,
    Payee,
    PayeeCreate,
    PayeePage,
    PayeeQuery,
    PayeeRename,
    PayeeVersion,
    StoredPayee,
} from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { payeePageSchema, payeeSchema } from "@/lib/validations/payees";

const payees: StoredPayee[] = structuredClone(SEED_PAYEES);

const created = new Map<
    string,
    { fingerprint: string; payee: Payee; at: number }
>();

const collator = new Intl.Collator(DEFAULT_LOCALE, { sensitivity: "base" });

const fold = (text: string) => text.toLocaleLowerCase(DEFAULT_LOCALE);

const stamp = () => new Date().toISOString();

const publish = (stored: StoredPayee): Payee => payeeSchema.parse(stored);

export const listStoredPayees = ({ search, cursor }: PayeeQuery): PayeePage => {
    const matches = payees
        .filter((payee) => fold(payee.name).includes(fold(search)))
        .sort(
            (a, b) =>
                collator.compare(a.name, b.name) || a.id.localeCompare(b.id),
        );
    const start = cursor
        ? matches.findIndex((payee) => payee.id === cursor) + 1
        : 0;
    const items = matches.slice(start, start + PAYEE_PAGE_SIZE);
    const more = start + PAYEE_PAGE_SIZE < matches.length;

    return payeePageSchema.parse({
        items,
        nextCursor: more ? (items.at(-1)?.id ?? null) : null,
        asOf: stamp(),
    });
};

export const addStoredPayee = ({
    input,
    idempotencyKey,
}: PayeeCreate): ActionResult<Payee> => {
    const destination = `${input.sortCode}${input.accountNumber}`;
    const fingerprint = `${input.name}|${destination}`;
    const at = new Date().getTime();
    const earlier = created.get(idempotencyKey);

    if (earlier && at - earlier.at < IDEMPOTENCY_WINDOW_MS) {
        return earlier.fingerprint === fingerprint
            ? { ok: true, data: earlier.payee }
            : refusal(
                  HTTP_STATUS.conflict,
                  REQUEST_FAILED,
                  PAYEE_REFUSAL.keyReused,
              );
    }

    const twin = payees.find((payee) => payee.destination === destination);
    if (twin) {
        return refusal(
            HTTP_STATUS.conflict,
            PAYEE_COPY.duplicate(twin.name),
            PAYEE_REFUSAL.duplicate,
        );
    }

    const stored: StoredPayee = {
        id: `pye_${nanoid()}`,
        name: input.name,
        destination,
        destinationLast4: destination.slice(-DESTINATION_VISIBLE_DIGITS),
        bankName: null,
        lastPaidAt: null,
        totalPaid: [],
        status: "pending_verification",
        paymentInProgress: false,
        updatedAt: stamp(),
    };
    payees.push(stored);

    const payee = publish(stored);
    created.set(idempotencyKey, { fingerprint, payee, at });
    return { ok: true, data: payee };
};

const locate = ({
    id,
    updatedAt,
}: PayeeVersion): StoredPayee | ActionFailure => {
    const stored = payees.find((payee) => payee.id === id);
    if (!stored) return refusal(HTTP_STATUS.notFound, REQUEST_FAILED);

    return stored.updatedAt === updatedAt
        ? stored
        : refusal(HTTP_STATUS.conflict, REQUEST_FAILED);
};

export const renameStoredPayee = (input: PayeeRename): ActionResult<Payee> => {
    const stored = locate(input);
    if ("ok" in stored) return stored;

    Object.assign(stored, { name: input.name, updatedAt: stamp() });
    return { ok: true, data: publish(stored) };
};

export const removeStoredPayee = (input: PayeeVersion): ActionResult<Payee> => {
    const stored = locate(input);
    if ("ok" in stored) return stored;

    if (stored.paymentInProgress) {
        return refusal(
            HTTP_STATUS.conflict,
            REQUEST_FAILED,
            PAYEE_REFUSAL.paymentInProgress,
        );
    }
    payees.splice(payees.indexOf(stored), 1);
    return { ok: true, data: publish(stored) };
};
