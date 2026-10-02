import AuthDivider from "@/components/auth/auth-divider";
import { ledgerButtonClass } from "@/components/ledgerline/ledger-button";
import { VERIFY_COPY } from "@/lib/data/auth/verify";
import type { VerifyMethod } from "@/lib/types";

interface Props {
    method: VerifyMethod;
    busy: boolean;
    passkey: { supported: boolean; pending: boolean; onUse: () => void };
    onSwitch: (method: VerifyMethod) => void;
}

const optionClass = (className: string) =>
    ledgerButtonClass(
        "ghost",
        "lg",
        `w-full cursor-pointer disabled:opacity-70 ${className}`,
    );

export default function VerifyOptions({
    method,
    busy,
    passkey,
    onSwitch,
}: Props) {
    const other = method === "code" ? "recovery" : "code";

    return (
        <div className="flex flex-col gap-3">
            <AuthDivider label={VERIFY_COPY.or} />
            {passkey.supported && (
                <button
                    type="button"
                    onClick={passkey.onUse}
                    disabled={busy}
                    aria-busy={passkey.pending}
                    className={optionClass("disabled:cursor-wait")}
                >
                    {passkey.pending
                        ? VERIFY_COPY.passkeyPending
                        : VERIFY_COPY.passkey}
                </button>
            )}
            <button
                type="button"
                onClick={() => onSwitch(other)}
                disabled={busy}
                className={optionClass("disabled:cursor-not-allowed")}
            >
                {VERIFY_COPY.switchTo[other]}
            </button>
        </div>
    );
}
