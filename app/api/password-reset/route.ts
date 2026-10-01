import { NextResponse, type NextRequest } from "next/server";
import { backendFetch, readJson, refuse, relay } from "@/lib/api-server";
import { backendRoutes } from "@/lib/api-routes";
import { HTTP_STATUS } from "@/lib/constants";
import { forgotSchema } from "@/lib/validations/auth";

export const POST = async (request: NextRequest) => {
    const input = forgotSchema.safeParse(await readJson(request));
    if (!input.success) return refuse(HTTP_STATUS.badRequest);

    const upstream = await backendFetch(backendRoutes.authPasswordReset(), {
        method: "POST",
        body: JSON.stringify(input.data),
    }).catch(() => null);

    if (upstream?.status === HTTP_STATUS.tooManyRequests)
        return relay(upstream);
    if (!upstream?.ok) return refuse(HTTP_STATUS.unavailable);

    return new NextResponse(null, { status: HTTP_STATUS.accepted });
};
