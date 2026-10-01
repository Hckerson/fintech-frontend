import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("next/headers", () => ({
    cookies: () => Promise.resolve({ get: () => undefined }),
}));

const postWith = (body: unknown) =>
    POST(
        new NextRequest(new URL("https://app.test/api/password-reset"), {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        }),
    );

const respondWith = (status: number, headers: Record<string, string> = {}) =>
    vi.fn().mockResolvedValue(new Response(null, { status, headers }));

beforeEach(() => {
    vi.stubGlobal("fetch", respondWith(204));
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("requesting a password reset", () => {
    it("answers the same way for every email the backend accepts", async () => {
        const known = await postWith({ email: "known@example.com" });
        const unknown = await postWith({ email: "unknown@example.com" });

        expect(known.status).toBe(202);
        expect(unknown.status).toBe(known.status);
        expect(await unknown.text()).toBe(await known.text());
    });

    it("sends the backend only the trimmed email", async () => {
        await postWith({ email: " ada@example.com ", role: "ADMIN" });

        expect(vi.mocked(fetch).mock.calls[0][1]?.body).toBe(
            JSON.stringify({ email: "ada@example.com" }),
        );
    });

    it("rejects a malformed email before reaching the backend", async () => {
        const response = await postWith({ email: "not-an-email" });

        expect(response.status).toBe(400);
        expect(fetch).not.toHaveBeenCalled();
    });

    it("passes on when to try again after too many requests", async () => {
        vi.stubGlobal("fetch", respondWith(429, { "Retry-After": "120" }));

        const response = await postWith({ email: "ada@example.com" });

        expect(response.status).toBe(429);
        expect(response.headers.get("Retry-After")).toBe("120");
    });

    it("answers 503 when the backend refuses or cannot be reached", async () => {
        vi.stubGlobal("fetch", respondWith(404));
        expect((await postWith({ email: "ada@example.com" })).status).toBe(503);

        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError()));
        expect((await postWith({ email: "ada@example.com" })).status).toBe(503);
    });
});
