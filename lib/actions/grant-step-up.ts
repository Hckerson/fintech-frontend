"use server";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import { SEED_STEP_UP_PASSWORD } from "@/lib/data/payments/accounts";
import { STEP_UP_COPY } from "@/lib/data/step-up";
import { STEP_UP_REJECTED } from "@/lib/payments/constants";
import { REVEAL_PURPOSE } from "@/lib/ledger/constants";
import { guardReveal } from "@/lib/ledger/guard";
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
    const session =
        input.purpose === REVEAL_PURPOSE
            ? await guardReveal()
            : await guardPayees();
    if ("ok" in session) return session;

    const parsed = stepUpSchema.safeParse(input);
    if (!parsed.success) {
        return refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
    }
    if (attemptsLeft(session.sub) <= 0) return locked();

    if (parsed.data.password !== SEED_STEP_UP_PASSWORD) {
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
