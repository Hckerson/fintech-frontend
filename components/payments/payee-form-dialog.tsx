"use client";
import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type ReactNode,
} from "react";
import StepUpDialog from "@/components/common/step-up-dialog";
import WriteStatus from "@/components/common/write-status";
import Button from "@/components/ui/button";
import Dialog from "@/components/ui/dialog";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { useOnline } from "@/lib/hooks/use-online";
import type { ProtectedWrite, StepUpPurpose } from "@/lib/types";

interface Props {
    title: string;
    description: string;
    submitLabel: string;
    purpose: StepUpPurpose;
    dirty: boolean;
    write: ProtectedWrite;
    fieldError?: boolean;
    message?: string;
    onSubmit: () => void;
    onClose: () => void;
    children: ReactNode;
}

export default function PayeeFormDialog({
    title,
    description,
    submitLabel,
    purpose,
    dirty,
    write,
    fieldError = false,
    message,
    onSubmit,
    onClose,
    children,
}: Props) {
    const online = useOnline();
    const form = useRef<HTMLFormElement>(null);
    const [discarding, setDiscarding] = useState(false);

    const focusInvalid = () =>
        requestAnimationFrame(() =>
            form.current
                ?.querySelector<HTMLElement>("[aria-invalid='true']")
                ?.focus(),
        );

    useEffect(() => {
        if (write.error) focusInvalid();
    }, [write.error]);

    const cancel = () => {
        if (write.pending) return;
        if (dirty) setDiscarding(true);
        else onClose();
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        onSubmit();
        focusInvalid();
    };

    return (
        <Dialog title={title} description={description} onCancel={cancel}>
            <form
                ref={form}
                onSubmit={submit}
                noValidate
                className="flex flex-col gap-4"
            >
                {children}
                <WriteStatus
                    notice={write.notice}
                    error={fieldError ? null : write.error}
                    message={message}
                />
                {online ? null : (
                    <p className="text-warning text-sm">{PAYEE_COPY.offline}</p>
                )}
                {discarding ? (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <p className="text-text mr-auto text-sm">
                            {PAYEE_COPY.discard.prompt}
                        </p>
                        <Button
                            tone="quiet"
                            size="lg"
                            autoFocus
                            onClick={() => setDiscarding(false)}
                        >
                            {PAYEE_COPY.discard.keep}
                        </Button>
                        <Button tone="danger" size="lg" onClick={onClose}>
                            {PAYEE_COPY.discard.confirm}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button
                            tone="ghost"
                            size="lg"
                            disabled={write.pending}
                            onClick={cancel}
                        >
                            {PAYEE_COPY.cancel}
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            isLoading={write.pending}
                            disabled={write.pending || !online}
                        >
                            {submitLabel}
                        </Button>
                    </div>
                )}
            </form>
            {write.asking ? (
                <StepUpDialog purpose={purpose} onSettle={write.settle} />
            ) : null}
        </Dialog>
    );
}
