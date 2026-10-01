"use client";
import { useEffect, useState } from "react";
import AuthNotice from "@/components/auth/auth-notice";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { RESET_PASSWORD_ROUTE } from "@/lib/constants";
import { RESET_COPY } from "@/lib/data/auth/reset";
import type { ResetLinkState } from "@/lib/types";

interface Props {
    token: string | undefined;
    link: ResetLinkState;
}

export default function ResetPasswordStep({ token, link }: Props) {
    const [held] = useState(token);
    const [state, setState] = useState<ResetLinkState | "done">(link);

    useEffect(() => {
        window.history.replaceState(null, "", RESET_PASSWORD_ROUTE);
    }, []);

    if (state === "done") return <AuthNotice {...RESET_COPY.done} />;
    if (state === "unavailable")
        return <AuthNotice {...RESET_COPY.unchecked} />;
    if (state === "invalid" || !held) {
        return <AuthNotice {...RESET_COPY.invalid} />;
    }

    return (
        <ResetPasswordForm
            token={held}
            onDone={() => setState("done")}
            onInvalid={() => setState("invalid")}
        />
    );
}
