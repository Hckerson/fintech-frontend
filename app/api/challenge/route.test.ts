import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SESSION_COOKIE } from "@/lib/constants";
import { POST } from "./route";

vi.mock("next/headers", () => ({
    cookies: () => Promise.resolve({ get: () => undefined }),
}));

const ATTEMPT = { method: "code", challenge: "chl_1", code: "123456" };

const signedIn = {
    data: {
        user: {
            id: "usr_1",
            name: "Ada",
            email: "ada@example.com",
            role: "USER",
        },
        accessToken: "signed.jwt.value",
        recoveryCodesRemaining: 4,
    },
};

const postWith = (body: unknown) =>
    POST(
        new NextRequest(new URL("https://app.test/api/challenge"), {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        }),
    );

const respondWith = (
    status: number,
    payload: unknown,
    headers: Record<string, string> = {},
) =>
    vi.stubGlobal(
        "fetch",
        vi
            .fn()
            .mockResolvedValue(
                new Response(JSON.stringify(payload), { status, headers }),
            ),
    );

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("answering a challenge", () => {
    it("starts the session without returning the token", async () => {
        respondWith(200, signedIn);

        const response = await postWith(ATTEMPT);
        const body = await response.json();

        expect(response.headers.get("set-cookie")).toContain(
            `${SESSION_COOKIE}=signed.jwt.value`,
        );
        expect(JSON.stringify(body)).not.toContain("signed.jwt.value");
        expect(body.recoveryCodesRemaining).toBe(4);
    });

    it("sets no cookie when a step-up answer carries no token", async () => {
        respondWith(200, { data: {} });

        const response = await postWith(ATTEMPT);

        expect(response.status).toBe(200);
        expect(response.headers.get("set-cookie")).toBeNull();
    });

    it("rejects a code that is not six digits before the backend", async () => {
        respondWith(200, signedIn);

        const response = await postWith({ ...ATTEMPT, code: "12345a" });

        expect(response.status).toBe(400);
        expect(fetch).not.toHaveBeenCalled();
    });

    it("passes on the attempts left and the lockout wait", async () => {
        respondWith(401, { attemptsRemaining: 2 });
        expect((await (await postWith(ATTEMPT)).json()).attemptsRemaining).toBe(
            2,
        );

        respondWith(423, {}, { "Retry-After": "900" });
        const locked = await postWith(ATTEMPT);
        expect(locked.status).toBe(423);
        expect(locked.headers.get("Retry-After")).toBe("900");
    });

    it("answers 503 when the backend fails", async () => {
        respondWith(500, {});

        expect((await postWith(ATTEMPT)).status).toBe(503);
    });
});
