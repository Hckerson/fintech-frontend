"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/ui/button";
import Dialog from "@/components/ui/dialog";
import ErrorReference from "@/components/ui/error-reference";
import Field from "@/components/ui/field";
import TextInput from "@/components/ui/text-input";
import { ERROR_MESSAGE } from "@/lib/data/error-messages";
import { STEP_UP_ACTIONS, STEP_UP_COPY } from "@/lib/data/step-up";
import { useStepUp } from "@/lib/hooks/use-step-up";
import { STEP_UP_REJECTED } from "@/lib/payments/constants";
import type { StepUpPurpose } from "@/lib/types";

interface Props {
    purpose: StepUpPurpose;
    onSettle: (granted: boolean) => void;
}

export default function StepUpDialog({ purpose, onSettle }: Props) {
    const stepUp = useStepUp();
    const input = useRef<HTMLInputElement>(null);
    const [password, setPassword] = useState("");
    const failure = stepUp.error;
    const locked = failure?.kind === "locked";
    const message = !failure
        ? undefined
        : locked || failure.code === STEP_UP_REJECTED
          ? failure.message
          : failure.kind === "validation"
            ? STEP_UP_COPY.missing
            : ERROR_MESSAGE[failure.kind];

    useEffect(() => {
        if (failure) input.current?.focus();
    }, [failure]);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (stepUp.isPending || locked) return;
        stepUp.mutate(
            { purpose, password },
            { onSuccess: () => onSettle(true) },
        );
    };

    return (
        <Dialog
            title={STEP_UP_COPY.title}
            description={STEP_UP_COPY.lead(STEP_UP_ACTIONS[purpose])}
            onCancel={() => stepUp.isPending || onSettle(false)}
        >
            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
                <Field label={STEP_UP_COPY.password} error={message}>
                    {(control) => (
                        <TextInput
                            {...control}
                            ref={input}
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            readOnly={stepUp.isPending}
                        />
                    )}
                </Field>
                {failure ? (
                    <ErrorReference reference={failure.reference} />
                ) : null}
                <div className="flex flex-wrap justify-end gap-2">
                    <Button
                        tone="ghost"
                        size="lg"
                        disabled={stepUp.isPending}
                        onClick={() => onSettle(false)}
                    >
                        {STEP_UP_COPY.cancel}
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        isLoading={stepUp.isPending}
                        disabled={stepUp.isPending || locked}
                    >
                        {STEP_UP_COPY.submit}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
