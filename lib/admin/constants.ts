import { ADMIN_ROUTE } from "@/lib/constants";
import type { StatsPeriod } from "@/lib/types";

export const ADMIN_USERS_ROUTE = `${ADMIN_ROUTE}/users`;

export const ADMIN_COMPLIANCE_ROUTE = `${ADMIN_ROUTE}/compliance`;

export const ADMIN_SUPPORT_ROUTE = `${ADMIN_ROUTE}/support`;

export const ADMIN_RANGE_PARAM = "range";

export const DEFAULT_STATS_PERIOD: StatsPeriod = "month";

export const SERIES_MAX_POINTS = 366;

export const DELTA_CEILING_TENTHS = 9_990;

export const ADMIN_TIME_ZONE = "UTC";

export const adminUserRoute = (userId: string) =>
    `${ADMIN_USERS_ROUTE}/${userId}`;

export const ADMIN_USERS_CLIENT_LIMIT = 1_000;

export const ADMIN_USERS_PAGE_SIZE = 50;

export const ADMIN_USER_QUERY_MIN = 2;

export const ADMIN_USER_QUERY_MAX = 100;

export const ADMIN_USERS_SKELETON_ROWS = 8;

export const ADMIN_USER_NAME_MAX = 120;

export const GROWTH_CHART = {
    width: 1000,
    height: 320,
    pad: 20,
    padX: 36,
    steps: 4,
    edge: 0.16,
} as const;
