"use server";
import { guardPlatform } from "@/lib/admin/guard";
import { seedSeries } from "@/lib/admin/stats-store";
import { readStamped } from "@/lib/api-server";
import { HTTP_STATUS, INVALID_REQUEST } from "@/lib/constants";
import { routes } from "@/lib/contract/routes";
import type { ActionResult, AdminUserSeries, StatsPeriod } from "@/lib/types";
import { refusal } from "@/lib/utils/action-error";
import { serverEnv } from "@/lib/utils/server-env";
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

    if (!serverEnv.liveData) {
        const refused = await guardPlatform();
        return refused ?? { ok: true, data: seedSeries(period.data) };
    }

    const result = await readStamped(
        routes.statsUsersSeries({ period: period.data }),
        adminUserSeriesSchema,
    );
    if (!result.ok) return refusal(result.status, result.message);

    return { ok: true, data: { ...result.data.data, asOf: result.data.asOf } };
};
