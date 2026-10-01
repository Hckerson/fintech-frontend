import "server-only";
import { HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import { hasGrant } from "@/lib/payments/step-up-store";
import { STEP_UP_REQUIRED } from "@/lib/query/constants";
import type { ActionFailure, StepUpPurpose } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { currentWorkspace } from "@/lib/utils/current-workspace";
import { roleCan } from "@/lib/utils/permissions";
import { serverEnv } from "@/lib/utils/server-env";
import { getSession } from "@/lib/utils/session";
import type { SessionPayload } from "@/lib/utils/verify-session-token";

export const guardPayees = async (
    purpose?: StepUpPurpose,
): Promise<SessionPayload | ActionFailure> => {
    if (!serverEnv.moneyMovement) {
        return refusal(HTTP_STATUS.notFound, REQUEST_FAILED);
    }

    const session = await getSession();
    if (!session) return refusal(HTTP_STATUS.unauthorized, REQUEST_FAILED);

    const workspace = await currentWorkspace();
    if (!roleCan(workspace?.role, "managePayees")) {
        return refusal(HTTP_STATUS.forbidden, REQUEST_FAILED);
    }

    return purpose && !hasGrant(session.sub, purpose)
        ? refusal(HTTP_STATUS.unauthorized, REQUEST_FAILED, STEP_UP_REQUIRED)
        : session;
};
