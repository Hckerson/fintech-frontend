import { nanoid } from "nanoid";
import { HTTP_STATUS } from "@/lib/constants";
import { STEP_UP_REQUIRED } from "@/lib/query/constants";
import type { ActionFailure, ErrorKind } from "@/lib/types/api";

const KIND_BY_STATUS: Partial<Record<number, ErrorKind>> = {
    [HTTP_STATUS.badRequest]: "validation",
    [HTTP_STATUS.unauthorized]: "unauthenticated",
    [HTTP_STATUS.forbidden]: "forbidden",
    [HTTP_STATUS.notFound]: "not_found",
    [HTTP_STATUS.conflict]: "conflict",
    [HTTP_STATUS.locked]: "locked",
    [HTTP_STATUS.tooManyRequests]: "rate_limited",
};

export const errorKind = (status: number, code?: string): ErrorKind =>
    code === STEP_UP_REQUIRED
        ? "step_up_required"
        : (KIND_BY_STATUS[status] ?? "unavailable");

export const refusal = (
    status: number,
    message: string,
    code?: string,
): ActionFailure => ({ ok: false, status, message, code, reference: nanoid() });

export class ActionError extends Error {
    constructor(
        readonly kind: ErrorKind,
        message: string,
        readonly reference: string = nanoid(),
        readonly code?: string,
    ) {
        super(message);
    }

    static from = ({ status, message, code, reference }: ActionFailure) =>
        new ActionError(errorKind(status, code), message, reference, code);
}
