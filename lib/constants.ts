import { createUserDtoSchema } from "@/lib/contract/schemas";
import { WORKSPACE_ROUTE_PREFIXES } from "@/lib/workspace/constants";

export const DATE_VALUE_FORMAT = "yyyy-MM-dd";

export const SESSION_COOKIE = "session";

export const AUTH_ROUTE_PREFIX = "/auth";

export const LOGIN_ROUTE = `${AUTH_ROUTE_PREFIX}/login`;

export const REGISTER_ROUTE = `${AUTH_ROUTE_PREFIX}/register`;

export const FORGOT_PASSWORD_ROUTE = `${AUTH_ROUTE_PREFIX}/forgot-password`;

export const RESET_PASSWORD_ROUTE = `${AUTH_ROUTE_PREFIX}/reset-password`;

export const VERIFY_ROUTE = `${AUTH_ROUTE_PREFIX}/verify`;

export const verifyRoute = (challenge: string, next: string) =>
    `${VERIFY_ROUTE}?${new URLSearchParams({ challenge, next })}`;

export const HOME_ROUTE = "/";

export const HELP_ROUTE = "/help";

export const HELP_QUERY_PARAM = "q";

export const helpArticleRoute = (slug: string) => `${HELP_ROUTE}/${slug}`;

export const DASHBOARD_ROUTE = "/dashboard";

export const PAYMENTS_ROUTE = "/payments";

export const TRANSFER_ROUTE = `${PAYMENTS_ROUTE}/transfer`;

export const transferRoute = (payeeId: string) =>
    `${TRANSFER_ROUTE}?${new URLSearchParams({ payeeId })}`;

export const ADMIN_ROUTE = "/admin";

export const PROFILE_ROUTE = "/settings/profile";

export const NOTIFICATIONS_ROUTE = "/notifications";

export const PROTECTED_ROUTE_PREFIXES = [
    DASHBOARD_ROUTE,
    PAYMENTS_ROUTE,
    ADMIN_ROUTE,
    NOTIFICATIONS_ROUTE,
    ...WORKSPACE_ROUTE_PREFIXES,
];

export const PAGE_TITLES = {
    dashboard: "Dashboard",
    accounts: "Accounts",
    payments: "Payees & bill pay",
    transfer: "Transfer",
    adminOverview: "Admin overview",
    adminUsers: "Admin users",
} as const;

export const NO_INDEX = { index: false, follow: false } as const;

export const MAIN_CONTENT_ID = "main-content";

export const NOT_AVAILABLE = "Not available";

export const AUTH_GATE_DISABLED =
    process.env.NODE_ENV !== "production" &&
    process.env.DISABLE_AUTH_GATE === "true";

export const ADMIN_ROLE = createUserDtoSchema.shape.role.unwrap().enum.ADMIN;

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const INVALID_CREDENTIALS = "Email or password is incorrect";

export const HTTP_STATUS = {
    accepted: 202,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    gone: 410,
    locked: 423,
    tooManyRequests: 429,
    serverError: 500,
    badGateway: 502,
    unavailable: 503,
} as const;

export const INVALID_REQUEST = "The request body is invalid";

export const REQUEST_FAILED = "The request could not be completed";

export const SESSION_UNAVAILABLE = "The account was created but sign-in failed";

export const PASSWORD_MIN_LENGTH = 8;

export const MOTION_DURATION = {
    fast: 0.2,
    normal: 0.35,
    slow: 0.6,
    slower: 0.8,
} as const;

export const MOTION_SPRING = {
    type: "spring",
    stiffness: 100,
    damping: 30,
} as const;

export const DEFAULT_LOCALE = "en-GB";

export const DEFAULT_CURRENCY = "GBP";

export const STALE_TIME = {
    live: 15_000,
    standard: 60_000,
    slow: 300_000,
} as const;

export const SLOW_REQUEST_MS = 10_000;

export const REQUEST_TIMEOUT_MS = 15_000;
