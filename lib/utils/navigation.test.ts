import { describe, expect, it } from "vitest";
import type { ShellNavItem } from "@/lib/types";
import { currentNavId, initialsOf } from "./navigation";

const ITEMS: ShellNavItem[] = [
    { id: "overview", label: "Overview", href: "/admin", icon: "overview" },
    { id: "users", label: "Users", href: "/admin/users", icon: "users" },
];

describe("the current navigation item", () => {
    it("is the longest segment-boundary prefix of the path", () => {
        expect(currentNavId("/admin", ITEMS)).toBe("overview");
        expect(currentNavId("/admin/users/42", ITEMS)).toBe("users");
    });

    it("does not match across a segment boundary", () => {
        expect(currentNavId("/administrator", ITEMS)).toBeUndefined();
    });
});

describe("initials", () => {
    it("takes the first letter of the first two words", () => {
        expect(initialsOf("ada  lovelace king")).toBe("AL");
        expect(initialsOf("")).toBe("");
    });
});
