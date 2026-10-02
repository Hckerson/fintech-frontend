import { ArrowDownRight, ArrowUpRight, Subtract } from "@carbon/icons-react";
import { DELTA_COPY } from "@/lib/data/admin/overview";
import type { Delta } from "@/lib/types";
import { deltaText } from "@/lib/utils/delta-text";

interface Props {
    delta: Delta | null;
    comparison?: string;
    fallback?: string;
}

const ICONS = { up: ArrowUpRight, down: ArrowDownRight, flat: Subtract };

export default function DeltaChip({
    delta,
    comparison,
    fallback = DELTA_COPY.none,
}: Props) {
    if (!delta) return <span className="text-text-muted">{fallback}</span>;

    const Icon = ICONS[delta.direction];

    return (
        <span className="text-text-secondary inline-flex items-center gap-1 whitespace-nowrap">
            <Icon aria-hidden className="text-accent size-3.5 shrink-0" />
            {deltaText(delta, comparison)}
        </span>
    );
}
