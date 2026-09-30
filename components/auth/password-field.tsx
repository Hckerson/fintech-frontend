"use client";
import { useState, type ComponentProps } from "react";
import { View, ViewOff } from "@carbon/icons-react";
import AuthField from "@/components/auth/auth-field";
import { AUTH_SHELL_COPY } from "@/lib/data/auth/shell";

type Props = Omit<ComponentProps<typeof AuthField>, "trailing">;

export default function PasswordField({ type, ...props }: Props) {
    const [revealed, setRevealed] = useState(false);

    return (
        <AuthField
            {...props}
            type={revealed ? "text" : type}
            trailing={
                <button
                    type="button"
                    onClick={() => setRevealed((value) => !value)}
                    aria-pressed={revealed}
                    aria-label={
                        revealed
                            ? AUTH_SHELL_COPY.hidePassword
                            : AUTH_SHELL_COPY.showPassword
                    }
                    className="text-text-muted hover:text-text focus-visible:outline-accent absolute inset-y-0 right-2 my-auto flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-2"
                >
                    {revealed ? (
                        <ViewOff aria-hidden className="size-4" />
                    ) : (
                        <View aria-hidden className="size-4" />
                    )}
                </button>
            }
        />
    );
}
