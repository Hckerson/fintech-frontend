"use client";
import { motion } from "motion/react";
import { ArrowUpRight } from "@carbon/icons-react";
import { CASH_SERIES, DASHBOARD } from "@/lib/data/ledgerline/dashboard";
import { areaPath, lastPoint, linePath } from "@/lib/ledgerline/chart";
import { formatMoney } from "@/lib/ledgerline/money";
import {
    FOOTER_CHART,
    LINE_DRAW_SECONDS,
    REVEAL_EASE,
} from "@/lib/ledgerline/constants";

const LINE = linePath(CASH_SERIES, FOOTER_CHART);
const AREA = areaPath(CASH_SERIES, FOOTER_CHART);
const [endX, endY] = lastPoint(CASH_SERIES, FOOTER_CHART);
const VIEW = { once: true, margin: "-10%" } as const;

export default function CashTile() {
    return (
        <div
            role="img"
            aria-label={`${DASHBOARD.cashTitle} ${formatMoney(DASHBOARD.cashTotalMinor, DASHBOARD.cashCurrency)}, ${DASHBOARD.delta} ${DASHBOARD.deltaLabel}. ${DASHBOARD.companyTag}.`}
            className="surface-card product-frame sheen flex flex-col gap-5 p-6"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-text-muted text-xs">
                        {DASHBOARD.cashTitle}
                    </span>
                    <span className="text-text text-2xl font-medium tracking-tight tabular-nums">
                        {formatMoney(
                            DASHBOARD.cashTotalMinor,
                            DASHBOARD.cashCurrency,
                        )}
                    </span>
                </div>
                <span className="text-text-muted flex items-center gap-2 font-mono text-xs">
                    <span
                        aria-hidden
                        className="animate-ledger-pulse bg-accent size-1.5 rounded-full motion-reduce:animate-none"
                    />
                    {DASHBOARD.companyTag}
                </span>
            </div>
            <svg
                viewBox={`0 0 ${FOOTER_CHART.width} ${FOOTER_CHART.height}`}
                className="h-auto w-full"
                aria-hidden
            >
                <motion.path
                    d={AREA}
                    className="signature-area"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={VIEW}
                    transition={{
                        duration: LINE_DRAW_SECONDS,
                        ease: REVEAL_EASE,
                    }}
                />
                <motion.path
                    d={LINE}
                    className="signature-line"
                    strokeWidth={2}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={VIEW}
                    transition={{
                        duration: LINE_DRAW_SECONDS,
                        ease: REVEAL_EASE,
                    }}
                />
                <circle
                    cx={endX}
                    cy={endY}
                    r={3.5}
                    className="fill-(--colors-line)"
                />
            </svg>
            <span className="text-success flex items-center gap-1 text-xs">
                <ArrowUpRight aria-hidden className="size-3.5" />
                {DASHBOARD.delta}
                <span className="text-text-muted">{DASHBOARD.deltaLabel}</span>
            </span>
        </div>
    );
}
