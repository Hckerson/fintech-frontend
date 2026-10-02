"use client";
import { useId, useLayoutEffect, useRef, type ReactNode } from "react";

interface Props {
    title: string;
    description?: string;
    alert?: boolean;
    onCancel: () => void;
    children: ReactNode;
}

export default function Dialog({
    title,
    description,
    alert = false,
    onCancel,
    children,
}: Props) {
    const ref = useRef<HTMLDialogElement>(null);
    const id = useId();

    useLayoutEffect(() => {
        const dialog = ref.current;
        dialog?.showModal();
        return () => dialog?.close();
    }, []);

    return (
        <dialog
            ref={ref}
            role={alert ? "alertdialog" : undefined}
            aria-labelledby={`${id}-title`}
            aria-describedby={description ? `${id}-description` : undefined}
            onCancel={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onCancel();
            }}
            onClose={(event) => {
                const dialog = event.currentTarget;
                if (
                    event.target === dialog &&
                    dialog.isConnected &&
                    !dialog.open
                ) {
                    dialog.showModal();
                }
            }}
            className="surface-card text-text backdrop:bg-overlay m-auto max-h-[calc(100dvh-2rem)] w-[min(100%-2rem,28rem)] overflow-y-auto"
        >
            <div className="flex flex-col gap-4 p-4">
                <header className="flex flex-col gap-2">
                    <h2 id={`${id}-title`} className="text-h6 text-text">
                        {title}
                    </h2>
                    {description ? (
                        <p
                            id={`${id}-description`}
                            className="text-text-secondary text-sm"
                        >
                            {description}
                        </p>
                    ) : null}
                </header>
                {children}
            </div>
        </dialog>
    );
}
