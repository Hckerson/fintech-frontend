import { describe, expect, it } from "vitest";
import type { AdminUser } from "@/lib/types";
import { matchUsers, newestFirst } from "./admin-users";

const user = (overrides: Partial<AdminUser>): AdminUser => ({
    id: "a",
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    phoneNumber: null,
    avatar: null,
    bio: null,
    role: "USER",
    status: "ACTIVE",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
    lastActive: null,
    ...overrides,
});

const USERS = [
    user({ id: "a" }),
    user({
        id: "b",
        fullName: "Grace Hopper",
        email: "grace@navy.example",
        role: "ADMIN",
        status: "SUSPENDED",
        createdAt: "2026-09-03T00:00:00.000Z",
    }),
    user({ id: "c", createdAt: "2026-09-03T00:00:00.000Z" }),
];

const ids = (users: AdminUser[]) => users.map(({ id }) => id);

describe("ordering the directory", () => {
    it("puts the newest user first and breaks ties by id", () => {
        expect(ids(newestFirst(USERS))).toEqual(["b", "c", "a"]);
    });
});

describe("narrowing the directory", () => {
    it("matches a fragment of the name or the email, ignoring case", () => {
        expect(ids(matchUsers(USERS, { q: "HOPP" }))).toEqual(["b"]);
        expect(ids(matchUsers(USERS, { q: "navy" }))).toEqual(["b"]);
    });

    it("combines role and status with the search", () => {
        expect(
            matchUsers(USERS, { q: "ada", role: "USER", status: "ACTIVE" }),
        ).toHaveLength(2);
        expect(matchUsers(USERS, { role: "ADMIN", status: "ACTIVE" })).toEqual(
            [],
        );
    });

    it("returns everyone when nothing narrows the list", () => {
        expect(matchUsers(USERS, {})).toHaveLength(3);
    });
});
