"use client";
import type { ReactNode } from "react";
import Button from "@/components/ui/button";
import Dialog from "@/components/ui/dialog";

interface Props {
    title: string;
    consequence: string;
    confirmLabel: string;
    cancelLabel: string;
    pending: boolean;
    blocked?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    children?: ReactNode;
}

export default function ConfirmDialog({
    title,
    consequence,
    confirmLabel,
    cancelLabel,
    pending,
    blocked = false,
    onConfirm,
    onCancel,
    children,
}: Props) {
    return (
        <Dialog
            alert
            title={title}
            description={consequence}
            onCancel={() => pending || onCancel()}
        >
            {children}
            <div className="flex flex-wrap justify-end gap-2">
                <Button
                    tone="ghost"
                    size="lg"
                    disabled={pending}
                    onClick={onCancel}
                >
                    {cancelLabel}
                </Button>
                <Button
                    tone="danger"
                    size="lg"
                    isLoading={pending}
                    disabled={pending || blocked}
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </Button>
            </div>
        </Dialog>
    );
}
