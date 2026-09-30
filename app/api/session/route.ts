import { NextResponse, type NextRequest } from "next/server";
import { backendFetch, readJson } from "@/lib/api-server";
import { HTTP_STATUS, SESSION_COOKIE } from "@/lib/constants";
import { routes } from "@/lib/contract/routes";
import { signInMessage } from "@/lib/data/auth/sign-in";
import { startSession } from "@/lib/utils/session";
import { loginSchema } from "@/lib/validations/auth";

const rejected = (status: number) =>
    NextResponse.json({ message: signInMessage(status) }, { status });

export const POST = async (request: NextRequest) => {
    const credentials = loginSchema.safeParse(await readJson(request));
    if (!credentials.success) return rejected(HTTP_STATUS.badRequest);

    const upstream = await backendFetch(routes.authLogin(), {
        method: "POST",
        body: JSON.stringify(credentials.data),
    }).catch(() => null);

    if (!upstream || upstream.status >= HTTP_STATUS.serverError) {
        return rejected(HTTP_STATUS.unavailable);
    }
    if (upstream.status === HTTP_STATUS.tooManyRequests) {
        return rejected(HTTP_STATUS.tooManyRequests);
    }

    return (await startSession(upstream)) ?? rejected(HTTP_STATUS.unauthorized);
};

export const DELETE = () => {
    const response = new NextResponse(null, { status: 204 });
    response.cookies.delete(SESSION_COOKIE);
    return response;
};
