import { forward } from "@/lib/api-server";
import { backendRoutes } from "@/lib/api-routes";
import { resetSchema } from "@/lib/validations/auth";

export const POST = forward(
    resetSchema,
    backendRoutes.authPasswordResetConfirm(),
);
