import { describe, expect, it } from "vitest";
import type { ExportJob, PendingGroup, VerificationCase } from "@/lib/types";
import { pendingItems } from "./pending-items";

const groups: PendingGroup[] = [
    {
        accountId: "acc_1",
        accountName: "Operating",
        count: 2,
        total: { amountMinor: "-1200", currency: "GBP" },
        oldestAt: "2026-09-01T00:00:00.000Z",
    },
];

const exports: ExportJob[] = [
    {
        id: "exp_ready",
        label: "September",
        state: "ready",
        updatedAt: "2026-09-02T00:00:00.000Z",
    },
    {
        id: "exp_failed",
        label: "Q3",
        state: "failed",
        updatedAt: "2026-09-03T00:00:00.000Z",
    },
    {
        id: "exp_expired",
        label: "August",
        state: "expired",
        updatedAt: "2026-08-01T00:00:00.000Z",
    },
];

const verification: VerificationCase = {
    id: "case_1",
    reference: "VC-1",
    state: "needs_info",
    requests: [
        {
            id: "req_1",
            message: "Upload a document.",
            fieldRef: "documents",
            createdAt: "2026-09-04T00:00:00.000Z",
        },
    ],
};

const kinds = (role: Parameters<typeof pendingItems>[0]["role"]) =>
    pendingItems({ role, groups, exports, verification }).map(
        ({ kind }) => kind,
    );

describe("pendingItems", () => {
    it("puts failures and requests before ready exports before pending transactions", () => {
        expect(kinds("owner")).toEqual([
            "export_failed",
            "verification_request",
            "export_ready",
            "pending_transactions",
        ]);
    });

    it("gives the owner a way to respond and the finance lead information only", () => {
        const hrefOf = (role: "owner" | "finance") =>
            pendingItems({ role, groups, exports, verification }).find(
                ({ kind }) => kind === "verification_request",
            )?.href;

        expect(hrefOf("owner")).toBe("/onboarding?step=documents");
        expect(hrefOf("finance")).toBeNull();
    });

    it("keeps verification requests from an accountant", () => {
        expect(kinds("accountant")).not.toContain("verification_request");
    });

    it("leaves out exports that are neither ready nor failed", () => {
        expect(
            pendingItems({ role: "owner", exports }).map(({ id }) => id),
        ).toEqual(["exp_failed", "exp_ready"]);
    });

    it("is empty when no source has anything waiting", () => {
        expect(
            pendingItems({ role: "owner", groups: [], exports: [] }),
        ).toEqual([]);
    });
});
