import { useMutation } from "@tanstack/react-query";
import { local } from "@/lib/api-client";
import { apiRoutes } from "@/lib/api-routes";
import type { ResetValues } from "@/lib/validations/auth";

export const useResetPassword = () =>
    useMutation({
        mutationFn: (input: ResetValues) =>
            local.post<unknown>(apiRoutes.passwordResetConfirm(), input),
    });
