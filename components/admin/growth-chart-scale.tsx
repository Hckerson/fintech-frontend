import { GROWTH_CHART } from "@/lib/admin/constants";
import { formatCount } from "@/lib/utils/admin-stats";

const { steps, pad, height } = GROWTH_CHART;

export default function GrowthChartScale({ max }: { max: number }) {
    return (
        <ol
            aria-hidden
            className="text-text-muted relative h-64 w-10 shrink-0 text-right text-xs tabular-nums sm:h-72"
        >
            {Array.from({ length: steps + 1 }, (_, step) => (
                <li
                    key={step}
                    className="absolute right-0 -translate-y-1/2"
                    style={{
                        top: `${((pad + (step / steps) * (height - pad * 2)) / height) * 100}%`,
                    }}
                >
                    {formatCount((max / steps) * (steps - step))}
                </li>
            ))}
        </ol>
    );
}
