import { describe, expect, it } from "vitest";
import type { TransferAccount, TransferOptions } from "@/lib/types";
import { amountWords } from "@/lib/utils/amount-words";
import { parseAmount } from "./amount";
import { settlementDay } from "./settlement";
import { destinationOf, sourceRefusal } from "./transfer-rules";
import {
    recordTransfer,
    replayTransfer,
    dailyRemaining,
    heldOn,
} from "./transfer-store";

const account = (patch: Partial<TransferAccount> = {}): TransferAccount => ({
    id: "acc_operating",
    name: "Operating",
    last4: "4417",
    currency: "GBP",
    availableMinor: "100000",
    state: "OPEN",
    ...patch,
});

const OPTIONS: TransferOptions = {
    accounts: [account(), account({ id: "acc_reserve", name: "Reserve" })],
    limits: { perTransferMinor: "50000", dailyRemainingMinor: "40000" },
    settlesOn: "2026-10-02",
    cutOffHour: 17,
    timeZone: "UTC",
    asOf: "2026-10-02T09:00:00.000Z",
};

const rules = (amountMinor: string, settlesOn = OPTIONS.settlesOn) => ({
    amountMinor,
    currency: "GBP",
    settlesOn,
});

describe("parsing an amount", () => {
    it.each([
        ["12.50", 2, "1250"],
        ["1,250", 2, "125000"],
        ["7", 0, "7"],
        ["0.005", 3, "5"],
    ])("reads %s at %i decimals as %s minor units", (text, digits, minor) => {
        expect(parseAmount(text, digits)?.toString()).toBe(minor);
    });

    it.each(["0", "0.00", "-5", "1.999", "abc", "", "1e3"])(
        "rejects %s",
        (text) => {
            expect(parseAmount(text, 2)).toBeNull();
        },
    );
});

describe("the amount in words", () => {
    it("spells the whole part and states the fraction exactly", () => {
        expect(amountWords("1284550", 2)).toBe(
            "Twelve thousand, eight hundred and forty-five and 50/100",
        );
        expect(amountWords("7", 0)).toBe("Seven");
        expect(amountWords("100", 2)).toBe("One and 00/100");
    });
});

describe("the settlement day", () => {
    it("is today before the cut-off on a working day", () => {
        expect(settlementDay(new Date("2026-10-02T16:59:00Z"), "UTC")).toBe(
            "2026-10-02",
        );
    });

    it("skips to the next working day after the cut-off or at a weekend", () => {
        expect(settlementDay(new Date("2026-10-02T17:00:00Z"), "UTC")).toBe(
            "2026-10-05",
        );
        expect(settlementDay(new Date("2026-10-04T09:00:00Z"), "UTC")).toBe(
            "2026-10-05",
        );
    });
});

describe("transfer refusals", () => {
    it("checks the source, balance, limits and cut-off in that order", () => {
        const [source] = OPTIONS.accounts;

        expect(sourceRefusal(source, rules("30000"), OPTIONS)).toBeNull();
        expect(sourceRefusal(undefined, rules("1"), OPTIONS)).toBe(
            "source_unavailable",
        );
        expect(
            sourceRefusal(account({ state: "FROZEN" }), rules("1"), OPTIONS),
        ).toBe("source_unavailable");
        expect(sourceRefusal(source, rules("100001"), OPTIONS)).toBe(
            "insufficient_funds",
        );
        expect(sourceRefusal(source, rules("50001"), OPTIONS)).toBe(
            "over_transfer_limit",
        );
        expect(sourceRefusal(source, rules("40001"), OPTIONS)).toBe(
            "over_daily_limit",
        );
        expect(sourceRefusal(source, rules("1", "2026-10-01"), OPTIONS)).toBe(
            "cut_off_passed",
        );
    });

    it("refuses an unverified payee and the source as its own destination", () => {
        const input = {
            fromAccountId: "acc_operating",
            currency: "GBP",
            amountMinor: "1",
            memo: null,
            settlesOn: OPTIONS.settlesOn,
        };

        expect(
            destinationOf(
                { ...input, destination: { kind: "payee", payeeId: "p" } },
                OPTIONS.accounts,
                {
                    name: "Sable",
                    destinationLast4: "0963",
                    status: "pending_verification",
                },
            ),
        ).toBe("destination_unavailable");
        expect(
            destinationOf(
                {
                    ...input,
                    destination: {
                        kind: "account",
                        accountId: "acc_operating",
                    },
                },
                OPTIONS.accounts,
                undefined,
            ),
        ).toBe("destination_unavailable");
    });
});

describe("the transfer stand-in", () => {
    const input = {
        fromAccountId: "acc_operating",
        destination: { kind: "account", accountId: "acc_reserve" } as const,
        amountMinor: "2500",
        currency: "GBP",
        memo: null,
        settlesOn: OPTIONS.settlesOn,
        idempotencyKey: "key_1",
    };
    const to = { name: "Reserve", last4: "4417" };

    it("yields one transfer for one key, however often it is sent", () => {
        expect(replayTransfer(input, "user")).toBeNull();

        const first = recordTransfer(
            input,
            account(),
            to,
            "user",
            "2026-10-02",
        );

        expect(replayTransfer(input, "user")).toEqual({
            ok: true,
            data: first,
        });
        expect(heldOn("acc_operating").toString()).toBe("2500");
        expect(dailyRemaining("user", "2026-10-02").toString()).toBe("9997500");
    });

    it("refuses the same key with a different body and hides it from others", () => {
        expect(
            replayTransfer({ ...input, amountMinor: "9" }, "user"),
        ).toMatchObject({ ok: false, code: "idempotency_key_reused" });
        expect(replayTransfer(input, "someone-else")).toBeNull();
    });
});
