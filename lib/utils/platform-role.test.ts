import { describe, expect, it } from "vitest";
import { ADMIN_ROLE } from "@/lib/constants";
import { adminNavFor, platformRoleOf } from "./platform-role";

const ids = (role: Parameters<typeof adminNavFor>[0]) =>
    adminNavFor(role).map((item) => item.id);

describe("the platform role of a session", () => {
    it("is admin for the one internal role the backend has today", () => {
        expect(platformRoleOf({ role: ADMIN_ROLE })).toBe("admin");
    });

    it("is absent for a workspace member and for no session", () => {
        expect(platformRoleOf({ role: "USER" })).toBeNull();
        expect(platformRoleOf(null)).toBeNull();
    });
});

describe("admin navigation by platform role", () => {
    it("gives a platform admin every destination in order", () => {
        expect(ids("admin")).toEqual([
            "overview",
            "users",
            "compliance",
            "support",
        ]);
    });

    it("gives support the overview and the support console only", () => {
        expect(ids("support")).toEqual(["overview", "support"]);
    });

    it("gives compliance the overview and the queue only", () => {
        expect(ids("compliance")).toEqual(["overview", "compliance"]);
    });
});
