import { describe, expect, it } from "vitest";
import { HTTP_STATUS } from "@/lib/constants";
import { PAYEE_REFUSAL } from "@/lib/payments/constants";
import {
    addStoredPayee,
    listStoredPayees,
    removeStoredPayee,
    renameStoredPayee,
} from "./payee-store";

const all = () =>
    listStoredPayees({ search: "", status: "all", cursor: null }).items;

const NEW_PAYEE = {
    name: "Ada Lovelace Ltd",
    sortCode: "112233",
    accountNumber: "44556677",
};

describe("the payee stand-in", () => {
    it("lists by name and never returns the full destination", () => {
        const names = all().map((payee) => payee.name);

        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
        expect(all().every((payee) => !("destination" in payee))).toBe(true);
    });

    it("narrows by a case-insensitive search", () => {
        const { items } = listStoredPayees({
            search: "TERN",
            status: "all",
            cursor: null,
        });

        expect(items.map((payee) => payee.id)).toEqual(["pye_tern"]);
    });

    it("filters by status and reports server-side counts", () => {
        const page = listStoredPayees({
            search: "",
            status: "pending_verification",
            cursor: null,
        });

        expect(page.items.map((payee) => payee.id)).toEqual(["pye_sable"]);
        expect(page.matched).toBe(1);
        expect(page.summary).toEqual({
            total: 7,
            active: 6,
            pendingVerification: 1,
            inProgress: 1,
        });
    });

    it("creates one record for a repeated idempotency key", () => {
        const before = all().length;
        const first = addStoredPayee({
            input: NEW_PAYEE,
            idempotencyKey: "k1",
        });
        const again = addStoredPayee({
            input: NEW_PAYEE,
            idempotencyKey: "k1",
        });

        expect(first).toEqual(again);
        expect(first.ok && first.data.status).toBe("pending_verification");
        expect(all()).toHaveLength(before + 1);
    });

    it("refuses a reused key that carries a different body", () => {
        const result = addStoredPayee({
            input: { ...NEW_PAYEE, name: "Someone else" },
            idempotencyKey: "k1",
        });

        expect(result).toMatchObject({
            status: HTTP_STATUS.conflict,
            code: PAYEE_REFUSAL.keyReused,
        });
    });

    it("detects a duplicate on the account details, not the name", () => {
        const result = addStoredPayee({
            input: { ...NEW_PAYEE, name: "A different name" },
            idempotencyKey: "k2",
        });

        expect(result).toMatchObject({
            status: HTTP_STATUS.conflict,
            code: PAYEE_REFUSAL.duplicate,
        });
    });

    it("refuses a rename based on a stale version and keeps the record", () => {
        const [payee] = all();
        const renamed = renameStoredPayee({ ...payee, name: "Renamed once" });
        const stale = renameStoredPayee({ ...payee, name: "Renamed twice" });

        expect(renamed.ok).toBe(true);
        expect(stale).toMatchObject({ status: HTTP_STATUS.conflict });
        expect(all().some((item) => item.name === "Renamed twice")).toBe(false);
    });

    it("refuses to remove a payee with a payment in progress", () => {
        const busy = all().find((payee) => payee.paymentInProgress);

        expect(busy && removeStoredPayee(busy)).toMatchObject({
            code: PAYEE_REFUSAL.paymentInProgress,
        });
    });

    it("removes once, then answers not found", () => {
        const target = all().find((payee) => payee.id === "pye_orchard");

        expect(target && removeStoredPayee(target).ok).toBe(true);
        expect(target && removeStoredPayee(target)).toMatchObject({
            status: HTTP_STATUS.notFound,
        });
    });
});
