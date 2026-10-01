import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { local } from "@/lib/api-client";
import { apiRoutes } from "@/lib/api-routes";
import { CODE_RESEND_DELAY_MS } from "@/lib/auth/constants";
import type { VerifyResult } from "@/lib/types";
import type { VerifyValues } from "@/lib/validations/auth";

export const useVerifyChallenge = () =>
    useMutation({
        mutationFn: (input: VerifyValues) =>
            local.post<VerifyResult>(apiRoutes.challenge(), input),
    });

export const useResendCode = () =>
    useMutation({
        mutationFn: (challenge: string) =>
            local.post<unknown>(apiRoutes.challengeResend(), { challenge }),
    });

export const useResendDelay = () => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (ready) return;
        const timer = setTimeout(() => setReady(true), CODE_RESEND_DELAY_MS);
        return () => clearTimeout(timer);
    }, [ready]);

    return [ready, () => setReady(false)] as const;
};
