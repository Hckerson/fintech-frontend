import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { revealAccountNumber } from "@/lib/actions/reveal-account-number";
import { REVEAL_TIMEOUT_MS, REVEAL_WARNING_MS } from "@/lib/ledger/constants";
import type { AccountNumber, AccountReveal } from "@/lib/types";
import type { ActionError } from "@/lib/utils/action-error";
import { unwrap } from "@/lib/utils/unwrap";

export const useAccountReveal = (): AccountReveal => {
    const [shown, setShown] = useState<AccountNumber | null>(null);
    const [warning, setWarning] = useState(false);
    const [round, setRound] = useState(0);
    const [challenge, setChallenge] = useState<string | null>(null);
    const [failedId, setFailedId] = useState<string | null>(null);
    const request = useMutation<AccountNumber, ActionError, string>({
        gcTime: 0,
        retry: false,
        mutationFn: async (accountId) =>
            unwrap(await revealAccountNumber(accountId)),
    });

    const hide = useCallback(() => {
        setShown(null);
        setWarning(false);
    }, []);

    useEffect(() => {
        if (!shown) return;
        const warn = setTimeout(
            () => setWarning(true),
            REVEAL_TIMEOUT_MS - REVEAL_WARNING_MS,
        );
        const mask = setTimeout(hide, REVEAL_TIMEOUT_MS);
        const onHidden = () => document.hidden && hide();

        document.addEventListener("visibilitychange", onHidden);
        window.addEventListener("blur", hide);
        return () => {
            clearTimeout(warn);
            clearTimeout(mask);
            document.removeEventListener("visibilitychange", onHidden);
            window.removeEventListener("blur", hide);
        };
    }, [shown, round, hide]);

    const reveal = (accountId: string) => {
        if (request.isPending) return;
        hide();
        setFailedId(null);
        request.mutate(accountId, {
            onSuccess: setShown,
            onError: (error) =>
                error.kind === "step_up_required"
                    ? setChallenge(accountId)
                    : setFailedId(accountId),
        });
    };

    return {
        shown,
        warning,
        pendingId: request.isPending ? request.variables : null,
        failedId,
        challenge,
        reveal,
        hide,
        extend: () => {
            setWarning(false);
            setRound((count) => count + 1);
        },
        settleChallenge: (granted) => {
            setChallenge(null);
            if (granted && challenge) reveal(challenge);
        },
    };
};
