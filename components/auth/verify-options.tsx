import AuthDivider from "@/components/auth/auth-divider";
import { buttonClass } from "@/components/ui/button";
import { VERIFY_COPY } from "@/lib/data/auth/verify";
import type { VerifyMethod } from "@/lib/types";

interface Props {
    method: VerifyMethod;
    busy: boolean;
    passkey: { supported: boolean; pending: boolean; onUse: () => void };
    onSwitch: (method: VerifyMethod) => void;
}

const optionClass = buttonClass("quiet", "xl", "w-full");

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
                    className={optionClass}
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
                className={optionClass}
            >
                {VERIFY_COPY.switchTo[other]}
            </button>
        </div>
    );
}
