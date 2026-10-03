import "server-only";
import { HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import { REVEAL_PURPOSE } from "@/lib/ledger/constants";
import { hasGrant } from "@/lib/payments/step-up-store";
import { STEP_UP_REQUIRED } from "@/lib/query/constants";
import type { ActionFailure } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { currentWorkspace } from "@/lib/utils/current-workspace";
import { roleCan } from "@/lib/utils/permissions";
import { getSession } from "@/lib/utils/session";
import type { SessionPayload } from "@/lib/utils/verify-session-token";

export const guardReveal = async (
    granted = false,
): Promise<SessionPayload | ActionFailure> => {
    const session = await getSession();
    if (!session) return refusal(HTTP_STATUS.unauthorized, REQUEST_FAILED);

    const workspace = await currentWorkspace();
    if (!roleCan(workspace?.role, "revealAccountNumber")) {
        return refusal(HTTP_STATUS.forbidden, REQUEST_FAILED);
    }

    return granted && !hasGrant(session.sub, REVEAL_PURPOSE)
        ? refusal(HTTP_STATUS.unauthorized, REQUEST_FAILED, STEP_UP_REQUIRED)
        : session;
};
