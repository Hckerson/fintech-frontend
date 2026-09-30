"use client";
import clsx from "clsx";
import { motion } from "motion/react";
import { CASH_SERIES } from "@/lib/data/ledgerline/dashboard";
import { linePath } from "@/lib/ledgerline/chart";
import {
    LINE_DRAW_SECONDS,
    REVEAL_EASE,
    RULE_CHART,
} from "@/lib/ledgerline/constants";

interface Props {
    className?: string;
    play?: "view" | "mount";
}

const PATH = linePath(CASH_SERIES, RULE_CHART);

export default function SignatureRule({ className = "h-10", play = "view" }: Props) {
    const drawn = { pathLength: 1 };

    return (
        <svg
            viewBox={`0 0 ${RULE_CHART.width} ${RULE_CHART.height}`}
            preserveAspectRatio="none"
            aria-hidden
            className={clsx("w-full", className)}
        >
            <motion.path
                d={PATH}
                className="signature-line"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={play === "mount" ? drawn : undefined}
                whileInView={play === "view" ? drawn : undefined}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: LINE_DRAW_SECONDS, ease: REVEAL_EASE }}
            />
        </svg>
    );
}
