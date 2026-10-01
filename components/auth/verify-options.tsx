import { ledgerButtonClass } from "@/components/ledgerline/ledger-button";
import { VERIFY_COPY } from "@/lib/data/auth/verify";
import type { VerifyMethod } from "@/lib/types";

interface Props {
    method: VerifyMethod;
    busy: boolean;
    passkey: { supported: boolean; pending: boolean; onUse: () => void };
    resend: { ready: boolean; onSend: () => void };
    onSwitch: (method: VerifyMethod) => void;
}

const linkClass =
    "text-text-muted hover:text-text cursor-pointer text-sm underline-offset-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:no-underline";

export default function VerifyOptions({
    method,
    busy,
    passkey,
    resend,
    onSwitch,
}: Props) {
    const other = method === "code" ? "recovery" : "code";

    return (
        <div className="flex flex-col gap-4">
            {passkey.supported && (
                <button
                    type="button"
                    onClick={passkey.onUse}
                    disabled={busy}
                    aria-busy={passkey.pending}
                    className={ledgerButtonClass(
                        "ghost",
                        "lg",
                        "w-full cursor-pointer disabled:cursor-wait disabled:opacity-70",
                    )}
                >
                    {passkey.pending
                        ? VERIFY_COPY.passkeyPending
                        : VERIFY_COPY.passkey}
                </button>
            )}
            <div className="flex flex-wrap justify-between gap-x-6 gap-y-2">
                {method === "code" && (
                    <button
                        type="button"
                        onClick={resend.onSend}
                        disabled={busy || !resend.ready}
                        className={linkClass}
                    >
                        {VERIFY_COPY.resend}
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => onSwitch(other)}
                    disabled={busy}
                    className={linkClass}
                >
                    {VERIFY_COPY.switchTo[other]}
                </button>
            </div>
        </div>
    );
}
