import type { ChartPoint } from "@/lib/types";

interface Props {
    points: readonly ChartPoint[];
    labels: { x: string; y: string; toggle: string };
}

export default function ChartTable({ points, labels }: Props) {
    return (
        <details>
            <summary className="text-text-muted hover:text-text w-fit cursor-pointer text-xs">
                {labels.toggle}
            </summary>
            <div className="mt-3 max-h-72 overflow-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th scope="col" className="data-head">
                                {labels.x}
                            </th>
                            <th scope="col" className="data-head text-right">
                                {labels.y}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {points.map((point) => (
                            <tr key={point.label}>
                                <th
                                    scope="row"
                                    className="data-cell text-text-secondary text-left font-normal"
                                >
                                    {point.label}
                                </th>
                                <td className="data-cell text-text text-right tabular-nums">
                                    {point.display}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </details>
    );
}
