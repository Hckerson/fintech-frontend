import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, Subtract } from "@carbon/icons-react";
import { DELTA_COPY } from "@/lib/data/admin/overview";
import type { Delta } from "@/lib/types";
import { deltaText } from "@/lib/utils/delta-text";

interface Props {
    delta: Delta | null;
    comparison?: string;
    fallback?: string;
    neutral?: boolean;
}

const ICONS = { up: ArrowUpRight, down: ArrowDownRight, flat: Subtract };

const TONES: Record<Delta["direction"], string> = {
    up: "text-success",
    down: "text-error",
    flat: "text-text-muted",
};

export default function DeltaChip({
    delta,
    comparison,
    fallback = DELTA_COPY.none,
    neutral = false,
}: Props) {
    if (!delta) return <span className="text-text-muted">{fallback}</span>;

    const Icon = ICONS[delta.direction];

    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1 whitespace-nowrap tabular-nums",
                neutral ? "text-text-secondary" : TONES[delta.direction],
            )}
        >
            <Icon aria-hidden className="size-3.5 shrink-0" />
            <span aria-hidden>{deltaText(delta, comparison)}</span>
            <span className="sr-only">
                {deltaText(delta, comparison ?? "")}
            </span>
        </span>
    );
}
