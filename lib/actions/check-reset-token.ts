"use server";
import { backendFetch } from "@/lib/api-server";
import { backendRoutes } from "@/lib/api-routes";
import { HTTP_STATUS } from "@/lib/constants";
import type { ResetLinkState } from "@/lib/types";

export const checkResetToken = async (
    token: string | undefined,
): Promise<ResetLinkState> => {
    if (!token) return "invalid";

    const upstream = await backendFetch(
        backendRoutes.authPasswordResetCheck(),
        {
            method: "POST",
            body: JSON.stringify({ token }),
        },
    ).catch(() => null);

    if (!upstream || upstream.status >= HTTP_STATUS.serverError) {
        return "unavailable";
    }
    return upstream.ok ? "valid" : "invalid";
};
