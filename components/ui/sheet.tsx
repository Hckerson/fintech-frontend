"use client";
import type { ReactNode } from "react";
import { Dialog as Primitive } from "radix-ui";
import { Close } from "@carbon/icons-react";

interface Props {
    open: boolean;
    title: string;
    description?: string;
    closeLabel: string;
    onClose: () => void;
    footer?: ReactNode;
    children: ReactNode;
}

export default function Sheet({
    open,
    title,
    description,
    closeLabel,
    onClose,
    footer,
    children,
}: Props) {
    return (
        <Primitive.Root open={open} onOpenChange={(next) => next || onClose()}>
            <Primitive.Portal>
                <Primitive.Overlay className="bg-overlay fixed inset-0 z-(--z-indices-modal-backdrop) transition-opacity duration-300 starting:opacity-0" />
                <Primitive.Content
                    aria-describedby={description ? undefined : ""}
                    className="border-border bg-background-alt ease-smooth fixed inset-y-0 right-0 z-(--z-indices-modal) flex w-full max-w-md flex-col border-l shadow-(--shadows-2xl) transition-transform duration-300 focus:outline-none starting:translate-x-full"
                >
                    <header className="border-border flex items-start justify-between gap-3 border-b p-4">
                        <div className="flex min-w-0 flex-col gap-1">
                            <Primitive.Title className="text-text text-h6 wrap-anywhere">
                                {title}
                            </Primitive.Title>
                            {description ? (
                                <Primitive.Description className="text-text-secondary text-sm">
                                    {description}
                                </Primitive.Description>
                            ) : null}
                        </div>
                        <Primitive.Close
                            aria-label={closeLabel}
                            className="text-text-secondary hover:bg-background-muted hover:text-text focus-visible:outline-accent flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md focus-visible:outline-2"
                        >
                            <Close aria-hidden className="size-4" />
                        </Primitive.Close>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                        {children}
                    </div>
                    {footer ? (
                        <footer className="border-border flex flex-wrap justify-end gap-2 border-t p-4">
                            {footer}
                        </footer>
                    ) : null}
                </Primitive.Content>
            </Primitive.Portal>
        </Primitive.Root>
    );
}
