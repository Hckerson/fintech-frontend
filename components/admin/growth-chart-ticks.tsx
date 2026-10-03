import clsx from "clsx";
import type { ChartPoint } from "@/lib/types";

interface Props {
    points: readonly ChartPoint[];
    spots: readonly { left: number }[];
    shown: number;
}

const DENSE_AFTER = 7;

export default function GrowthChartTicks({ points, spots, shown }: Props) {
    const last = points.length - 1;

    return (
        <ol aria-hidden className="text-text-muted relative ml-13 h-4 text-xs">
            {points.map((point, index) => (
                <li
                    key={point.label}
                    style={{ left: `${spots[index].left * 100}%` }}
                    className={clsx(
                        "absolute -translate-x-1/2 whitespace-nowrap",
                        index === shown && "text-text",
                        points.length > DENSE_AFTER &&
                            index % 2 !== last % 2 &&
                            "max-sm:hidden",
                    )}
                >
                    {point.tick ?? point.label}
                </li>
            ))}
        </ol>
    );
}
