import { linePath } from "@/lib/ledgerline/chart";
import type { ChartBox } from "@/lib/types";

interface Props {
    values: readonly number[];
    box: ChartBox;
}

export default function TrendLine({ values, box }: Props) {
    return (
        <svg
            aria-hidden
            viewBox={`0 0 ${box.width} ${box.height}`}
            preserveAspectRatio="none"
            className="h-9 w-24 shrink-0"
        >
            <path
                d={linePath(values, box)}
                fill="none"
                className="stroke-accent"
                strokeWidth={1.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
