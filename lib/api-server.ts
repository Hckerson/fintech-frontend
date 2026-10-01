import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiEnvelopeDtoSchema } from "@/lib/contract/schemas";
import type { ActionResult, Stamped } from "@/lib/types/api";
import {
    API_BASE_URL,
    HTTP_STATUS,
    REQUEST_FAILED,
    SESSION_COOKIE,
} from "@/lib/constants";

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

export const relay = (upstream: Response) => {
    const retryAfter = upstream.headers.get("Retry-After");

    return new NextResponse(upstream.body, {
        status: upstream.status,
        headers: {
            "Content-Type": "application/json",
            ...(retryAfter ? { "Retry-After": retryAfter } : {}),
        },
    });
};

export const refuse = (status: number) =>
    NextResponse.json({ message: REQUEST_FAILED }, { status });

export const forward =
    (schema: z.ZodType, path: string) => async (request: Request) => {
        const input = schema.safeParse(await readJson(request));
        if (!input.success) return refuse(HTTP_STATUS.badRequest);

        const upstream = await backendFetch(path, {
            method: "POST",
            body: JSON.stringify(input.data),
        }).catch(() => null);

        return !upstream || upstream.status >= HTTP_STATUS.serverError
            ? refuse(HTTP_STATUS.unavailable)
            : relay(upstream);
    };

export const readStamped = async <TData>(
    path: string,
    schema: z.ZodType<TData>,
): Promise<ActionResult<Stamped<TData>>> => {
    const upstream = await backendFetch(path).catch(() => null);
    if (!upstream) return { ok: false, status: 503, message: REQUEST_FAILED };

    const envelope = apiEnvelopeDtoSchema
        .extend({ data: schema })
        .safeParse(await readJson(upstream));
    if (upstream.ok && envelope.success) {
        return {
            ok: true,
            data: {
                data: envelope.data.data as TData,
                asOf: envelope.data.timestamp,
            },
        };
    }
    return {
        ok: false,
        status: upstream.ok ? 502 : upstream.status,
        message: REQUEST_FAILED,
    };
};

export const readEnvelope = async <TData>(
    path: string,
    schema: z.ZodType<TData>,
): Promise<ActionResult<TData>> => {
    const result = await readStamped(path, schema);
    return result.ok ? { ok: true, data: result.data.data } : result;
};
