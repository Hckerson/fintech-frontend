"use server";
import { readStamped } from "@/lib/api-server";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import { routes } from "@/lib/contract/routes";
import type { ActionResult, AdminUserSeries, StatsPeriod } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import {
    adminUserSeriesSchema,
    statsPeriodSchema,
} from "@/lib/validations/admin-stats";

export const getAdminUserSeries = async (
    input: StatsPeriod,
): Promise<ActionResult<AdminUserSeries>> => {
    const period = statsPeriodSchema.safeParse(input);
    if (!period.success) {
        return refusal(HTTP_STATUS.badRequest, INVALID_REQUEST);
    }

    const result = await readStamped(
        routes.statsUsersSeries({ period: period.data }),
        adminUserSeriesSchema,
    );
    if (!result.ok) return refusal(result.status, result.message);

    return { ok: true, data: { ...result.data.data, asOf: result.data.asOf } };
};
