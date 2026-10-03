import clsx from "clsx";
import { Checkmark } from "@carbon/icons-react";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import type { TransferStep } from "@/lib/types";

const ORDER: readonly TransferStep[] = ["edit", "review", "done"];

export default function TransferSteps({ step }: { step: TransferStep }) {
    const current = ORDER.indexOf(step);

    return (
        <ol
            aria-label={TRANSFER_COPY.stepsLabel}
            className="text-text-muted flex flex-wrap items-center gap-3 text-xs"
        >
            {ORDER.map((id, index) => {
                const done = index < current || step === "done";
                return (
                    <li
                        key={id}
                        aria-current={index === current ? "step" : undefined}
                        className={clsx(
                            "flex items-center gap-2",
                            index <= current && "text-text",
                        )}
                    >
                        <span
                            className={clsx(
                                "flex size-5 items-center justify-center rounded-full border tabular-nums",
                                done
                                    ? "border-success/40 text-success"
                                    : index === current
                                      ? "border-accent text-accent"
                                      : "border-border",
                            )}
                        >
                            {done ? (
                                <Checkmark aria-hidden className="size-3" />
                            ) : (
                                index + 1
                            )}
                        </span>
                        {TRANSFER_COPY.steps[id]}
                        {index < ORDER.length - 1 ? (
                            <span
                                aria-hidden
                                className="bg-border ml-1 h-px w-8"
                            />
                        ) : null}
                    </li>
                );
            })}
        </ol>
    );
}
