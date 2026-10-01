import { useMutation } from "@tanstack/react-query";
import { local } from "@/lib/api-client";
import { apiRoutes } from "@/lib/api-routes";
import type { ForgotValues } from "@/lib/validations/auth";

export const useRequestPasswordReset = () =>
    useMutation({
        mutationFn: (input: ForgotValues) =>
            local.post<void>(apiRoutes.passwordReset(), input),
    });
