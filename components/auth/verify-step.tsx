"use client";
import { useEffect, useState } from "react";
import AuthNotice from "@/components/auth/auth-notice";
import VerifyForm from "@/components/auth/verify-form";
import { VERIFY_ROUTE } from "@/lib/constants";
import {
    VERIFY_COPY,
    verifyLocked,
    verifyRecovered,
} from "@/lib/data/auth/verify";

interface Props {
    challenge: string | undefined;
    next: string;
}

type State =
    | { kind: "form" | "expired" }
    | { kind: "locked"; retryAfter: number | undefined }
    | { kind: "recovered"; remaining: number | undefined };

export default function VerifyStep({ challenge, next }: Props) {
    const [held] = useState(challenge);
    const [state, setState] = useState<State>({ kind: "form" });

    useEffect(() => {
        window.history.replaceState(null, "", VERIFY_ROUTE);
    }, []);

    if (state.kind === "locked") {
        return <AuthNotice {...verifyLocked(state.retryAfter)} />;
    }
    if (state.kind === "recovered") {
        return <AuthNotice {...verifyRecovered(state.remaining, next)} />;
    }
    if (state.kind === "expired" || !held) {
        return <AuthNotice {...VERIFY_COPY.expired} />;
    }

    return (
        <VerifyForm
            challenge={held}
            next={next}
            onExpired={() => setState({ kind: "expired" })}
            onLocked={(retryAfter) => setState({ kind: "locked", retryAfter })}
            onRecovered={(remaining) =>
                setState({ kind: "recovered", remaining })
            }
        />
    );
}
