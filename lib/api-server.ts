import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiEnvelopeDtoSchema } from "@/lib/contract/schemas";
import type { ActionResult } from "@/lib/types/api";
import { API_BASE_URL, REQUEST_FAILED, SESSION_COOKIE } from "@/lib/constants";

export const backendFetch = async (path: string, init: RequestInit = {}) => {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;

    return fetch(`${API_BASE_URL}${path}`, {
        ...init,
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            ...init.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
};

export const readJson = async (source: Request | Response): Promise<unknown> =>
    await source.json().catch(() => null);

export const relay = (upstream: Response) =>
    new NextResponse(upstream.body, {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
    });

export const readEnvelope = async <TData>(
    path: string,
    schema: z.ZodType<TData>,
): Promise<ActionResult<TData>> => {
    const upstream = await backendFetch(path).catch(() => null);
    if (!upstream) return { ok: false, status: 503, message: REQUEST_FAILED };

    const envelope = apiEnvelopeDtoSchema
        .extend({ data: schema })
        .safeParse(await readJson(upstream));
    if (upstream.ok && envelope.success) {
        return { ok: true, data: envelope.data.data as TData };
    }
    return {
        ok: false,
        status: upstream.ok ? 502 : upstream.status,
        message: REQUEST_FAILED,
    };
};
