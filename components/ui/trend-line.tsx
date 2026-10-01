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
            className="h-10 w-40 shrink-0"
        >
            <path
                d={linePath(values, box)}
                className="signature-line"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
