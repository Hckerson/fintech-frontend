import { useMutation } from "@tanstack/react-query";
import { grantStepUp } from "@/lib/actions/grant-step-up";
import { settle } from "@/lib/utils/unwrap";
import { MUTATION_TIMEOUT_MS } from "@/lib/query/constants";
import type { StepUpRequest } from "@/lib/types";
import type { ActionError } from "@/lib/utils/action-error";

export const useStepUp = () =>
    useMutation<null, ActionError, StepUpRequest>({
        networkMode: "always",
        retry: false,
        mutationFn: (input) =>
            settle(grantStepUp(input), MUTATION_TIMEOUT_MS, "unavailable"),
    });
