import { describe, expect, it } from "vitest";
import type { Account } from "@/lib/types";
import { parseAccountsParams } from "@/lib/validations/accounts";
import { accountGroups } from "./account-directory";

const account = (
    id: string,
    currency: string,
    available: string,
    state: Account["state"] = "OPEN",
): Account => ({
    id,
    name: id,
    kind: "OPERATING",
    last4: "0000",
    currency,
    available: { amountMinor: available, currency },
    current: { amountMinor: available, currency },
    state,
    openedAt: "2026-01-01T00:00:00.000Z",
});

const ACCOUNTS = [
    account("small", "GBP", "100"),
    account("huge", "GBP", "90000000000000000001"),
    account("euro", "EUR", "5000"),
    account("shut", "GBP", "700", "CLOSED"),
];

const ids = (raw: Record<string, string>) =>
    accountGroups(ACCOUNTS, parseAccountsParams(raw)).map((group) => [
        group.currency,
        ...group.accounts.map(({ id }) => id),
    ]);

describe("accountGroups", () => {
    it("groups by currency and sorts by available balance within each, largest first", () => {
        expect(ids({})).toEqual([
            ["EUR", "euro"],
            ["GBP", "huge", "shut", "small"],
        ]);
    });

    it("keeps closed accounts listed and lets the member narrow to them", () => {
        expect(ids({ state: "closed" })).toEqual([["GBP", "shut"]]);
    });

    it("narrows by currency and reverses on request", () => {
        expect(ids({ currency: "GBP", sort: "available", dir: "asc" })).toEqual(
            [["GBP", "small", "shut", "huge"]],
        );
    });

    it("gives nothing, not everything, when the filter matches no account", () => {
        expect(ids({ state: "frozen" })).toEqual([]);
    });

    it("drops an unusable setting and names it", () => {
        const params = parseAccountsParams({ sort: "colour", state: "open" });

        expect(params.sort).toBe("available");
        expect(params.state).toBeUndefined();
        expect(params.dropped).toEqual(["state", "sort"]);
    });
});
