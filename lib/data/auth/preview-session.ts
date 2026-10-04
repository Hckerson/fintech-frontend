import { ADMIN_ROLE, SESSION_MAX_AGE } from "@/lib/constants";
import type { SessionPayload } from "@/lib/utils/verify-session-token";

export const PREVIEW_SESSION: SessionPayload = {
    sub: "usr_preview",
    email: "preview@northwind.example",
    role: ADMIN_ROLE,
    iat: 0,
    exp: SESSION_MAX_AGE,
};
