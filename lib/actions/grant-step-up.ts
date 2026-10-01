"use server";
import { backendFetch } from "@/lib/api-server";
import { HTTP_STATUS, INVALID_REQUEST, REQUEST_FAILED } from "@/lib/constants";
import { routes } from "@/lib/contract/routes";
import { STEP_UP_COPY } from "@/lib/data/step-up";
import { STEP_UP_REJECTED } from "@/lib/payments/constants";
import { guardPayees } from "@/lib/payments/guard";
import {
    attemptsLeft,
    giveGrant,
    recordFailure,
} from "@/lib/payments/step-up-store";
import type { ActionResult, StepUpRequest } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { stepUpSchema } from "@/lib/validations/payees";

const locked = () => refusal(HTTP_STATUS.locked, STEP_UP_COPY.locked);

export const grantStepUp = async (
    input: StepUpRequest,
): Promise<ActionResult<null>> => {
    const session = await guardPayees();
    if ("ok" in session) return session;

    const parsed = stepUpSchema.safeParse(input);
    if (!parsed.success) {
        return refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
    }
    if (attemptsLeft(session.sub) <= 0) return locked();

    const upstream = await backendFetch(routes.authLogin(), {
        method: "POST",
        body: JSON.stringify({
            email: session.email,
            password: parsed.data.password,
        }),
    }).catch(() => null);

    if (!upstream || upstream.status >= HTTP_STATUS.serverError) {
        return refusal(HTTP_STATUS.unavailable, REQUEST_FAILED);
    }
    if (upstream.status === HTTP_STATUS.tooManyRequests) {
        return refusal(HTTP_STATUS.tooManyRequests, REQUEST_FAILED);
    }
    if (!upstream.ok) {
        const left = recordFailure(session.sub);
        return left > 0
            ? refusal(
                  HTTP_STATUS.unauthorized,
                  STEP_UP_COPY.wrong(left),
                  STEP_UP_REJECTED,
              )
            : locked();
    }

    giveGrant(session.sub, parsed.data.purpose);
    return { ok: true, data: null };
};
