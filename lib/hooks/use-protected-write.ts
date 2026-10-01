import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { STEP_UP_COPY } from "@/lib/data/step-up";
import type { ProtectedWrite } from "@/lib/types";
import type { ActionError } from "@/lib/utils/action-error";

export const useProtectedWrite = <TInput, TData>(
    mutation: UseMutationResult<TData, ActionError, TInput>,
): ProtectedWrite & {
    submit: (input: TInput, onSuccess: (data: TData) => void) => void;
} => {
    const [asking, setAsking] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const needsStepUp = mutation.error?.kind === "step_up_required";

    return {
        pending: mutation.isPending,
        asking,
        notice,
        error: needsStepUp ? null : mutation.error,
        reset: mutation.reset,
        settle: (granted) => {
            setAsking(false);
            setNotice(granted ? STEP_UP_COPY.granted : STEP_UP_COPY.cancelled);
        },
        submit: (input, onSuccess) => {
            if (mutation.isPending) return;
            setNotice(null);
            mutation.mutate(input, {
                onSuccess,
                onError: (error) => {
                    if (error.kind === "step_up_required") setAsking(true);
                },
            });
        },
    };
};
