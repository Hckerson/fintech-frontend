import { describe, expect, it } from "vitest";
import { currentNavItem, keepsRoute, navFor, navHref } from "./workspace-nav";

const ids = (role: Parameters<typeof navFor>[0], moneyMovement = false) =>
    navFor(role, moneyMovement).map(({ id }) => id);

describe("workspace navigation", () => {
    it("offers a viewer only what a viewer may open", () => {
        expect(ids("viewer")).toEqual([
            "dashboard",
            "accounts",
            "transactions",
            "notifications",
            "settings",
            "help",
        ]);
    });

    it("offers Payments only when money movement is on and the role may use it", () => {
        expect(ids("owner")).not.toContain("payments");
        expect(ids("owner", true)).toContain("payments");
        expect(ids("accountant", true)).not.toContain("payments");
    });

    it("sends roles without workspace settings to their profile", () => {
        const settings = (role: Parameters<typeof navFor>[0]) =>
            navHref(
                navFor(role, false).find(({ id }) => id === "settings")!,
                role,
            );

        expect(settings("owner")).toBe("/settings");
        expect(settings("viewer")).toBe("/settings/profile");
    });

    it("marks the longest segment-boundary match as current", () => {
        const items = navFor("owner", false);

        expect(currentNavItem("/transactions/flagged", items)?.id).toBe(
            "transactions",
        );
        expect(currentNavItem("/counterparties/cp_1", items)?.id).toBe(
            "transactions",
        );
        expect(currentNavItem("/accounts-payable", items)).toBeUndefined();
        expect(currentNavItem("/onboarding", items)).toBeUndefined();
    });

    it("keeps a list route across a switch only when the new role may open it", () => {
        expect(keepsRoute("/statements", "accountant", false)).toBe(true);
        expect(keepsRoute("/statements", "viewer", false)).toBe(false);
        expect(keepsRoute("/accounts/acc_1", "owner", false)).toBe(false);
    });
});
