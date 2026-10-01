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
