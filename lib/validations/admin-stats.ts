import { z } from "zod";
import {
    DEFAULT_STATS_PERIOD,
    SERIES_MAX_POINTS,
} from "@/lib/admin/constants";
import {
    periodSeriesResponseDtoSchema,
    periodTotalResponseDtoSchema,
    seriesPointDtoSchema,
} from "@/lib/contract/schemas";

export const statsPeriodSchema = periodTotalResponseDtoSchema.shape.period;

export const adminStatsSearchParamsSchema = z.object({
    range: statsPeriodSchema.catch(DEFAULT_STATS_PERIOD),
});

export const adminUserSeriesSchema = periodSeriesResponseDtoSchema.extend({
    points: z.array(seriesPointDtoSchema).max(SERIES_MAX_POINTS),
});
