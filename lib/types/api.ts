import type { ApiEnvelopeDto } from "@/lib/contract/schemas";

export type Endpoint<TResponse = unknown> = string & {
    readonly __response?: TResponse;
};

export type ApiResponse<TData> = ApiEnvelopeDto & { data: TData };

export type ActionFailure = {
    ok: false;
    status: number;
    message: string;
    code?: string;
    reference?: string;
};

export type ActionResult<TData> = { ok: true; data: TData } | ActionFailure;

export type Stamped<TData> = { data: TData; asOf: string };

export type ErrorKind =
    | "validation"
    | "unauthenticated"
    | "step_up_required"
    | "forbidden"
    | "not_found"
    | "conflict"
    | "locked"
    | "rate_limited"
    | "unavailable"
    | "offline"
    | "unconfirmed";
