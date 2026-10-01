import { forward } from "@/lib/api-server";
import { backendRoutes } from "@/lib/api-routes";
import { challengeSchema } from "@/lib/validations/auth";

export const POST = forward(
    challengeSchema,
    backendRoutes.authChallengePasskey(),
);
