"use server";
import { readEnvelope, readStamped } from "@/lib/api-server";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import { routes } from "@/lib/contract/routes";
import { periodTotalResponseDtoSchema } from "@/lib/contract/schemas";
import type { ActionResult, AdminUserTotal, StatsPeriod } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { statsPeriodSchema } from "@/lib/validations/admin-stats";

export const getAdminUserTotal = async (
    input: StatsPeriod,
): Promise<ActionResult<AdminUserTotal>> => {
    const parsed = statsPeriodSchema.safeParse(input);
    if (!parsed.success) {
        return refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
    }
    const period = parsed.data;

    const current = await readStamped(
        routes.statsUsersTotal({ period }),
        periodTotalResponseDtoSchema,
    );
    if (!current.ok) return refusal(current.status, current.message);

    const lastInstantBefore = new Date(
        Date.parse(current.data.data.start) - 1,
    ).toISOString();
    const previous = await readEnvelope(
        routes.statsUsersTotal({ period, date: lastInstantBefore }),
        periodTotalResponseDtoSchema,
    );
    if (!previous.ok) return refusal(previous.status, previous.message);

    return {
        ok: true,
        data: {
            ...current.data.data,
            asOf: current.data.asOf,
            previousTotal: previous.data.total,
        },
    };
};
