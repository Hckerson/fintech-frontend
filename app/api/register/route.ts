import { NextResponse, type NextRequest } from "next/server";
import { backendFetch, readJson, relay } from "@/lib/api-server";
import {
    HTTP_STATUS,
    INVALID_REQUEST,
    REQUEST_FAILED,
    SESSION_UNAVAILABLE,
} from "@/lib/constants";
import { routes } from "@/lib/contract/routes";
import { startSession } from "@/lib/utils/session";
import { registerSchema } from "@/lib/validations/auth";

export const POST = async (request: NextRequest) => {
    const input = registerSchema.safeParse(await readJson(request));
    if (!input.success) {
        return NextResponse.json(
            { message: INVALID_REQUEST },
            { status: HTTP_STATUS.badRequest },
        );
    }

    const upstream = await backendFetch(routes.authRegister(), {
        method: "POST",
        body: JSON.stringify(input.data),
    }).catch(() => null);
    if (!upstream) {
        return NextResponse.json(
            { message: REQUEST_FAILED },
            { status: HTTP_STATUS.unavailable },
        );
    }
    if (!upstream.ok) return relay(upstream);

    return (
        (await startSession(upstream)) ??
        NextResponse.json(
            { message: SESSION_UNAVAILABLE },
            { status: HTTP_STATUS.badGateway },
        )
    );
};
