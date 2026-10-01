import { NextResponse, type NextRequest } from "next/server";
import { backendFetch, readJson, refuse, relay } from "@/lib/api-server";
import { backendRoutes } from "@/lib/api-routes";
import { HTTP_STATUS } from "@/lib/constants";
import { startSession } from "@/lib/utils/session";
import { verifyResultSchema, verifySchema } from "@/lib/validations/auth";

export const POST = async (request: NextRequest) => {
    const input = verifySchema.safeParse(await readJson(request));
    if (!input.success) return refuse(HTTP_STATUS.badRequest);

    const upstream = await backendFetch(backendRoutes.authChallenge(), {
        method: "POST",
        body: JSON.stringify(input.data),
    }).catch(() => null);

    if (!upstream || upstream.status >= HTTP_STATUS.serverError) {
        return refuse(HTTP_STATUS.unavailable);
    }
    if (!upstream.ok) return relay(upstream);

    const result = verifyResultSchema.safeParse(
        await readJson(upstream.clone()),
    );
    const response = NextResponse.json({
        recoveryCodesRemaining: result.data?.data.recoveryCodesRemaining,
    });
    const session = await startSession(upstream);
    session?.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));

    return response;
};
