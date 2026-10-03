"use client";
import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { MOTION_DURATION } from "@/lib/constants";

interface Props {
    value: number;
    format: (value: number) => string;
    className?: string;
}

export default function CountUp({ value, format, className }: Props) {
    const ref = useRef<HTMLDataElement>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) return;

        const controls = animate(0, value, {
            duration: MOTION_DURATION.slower,
            ease: "easeOut",
            onUpdate: (current) => {
                if (ref.current) {
                    ref.current.textContent = format(Math.round(current));
                }
            },
        });
        return () => controls.stop();
    }, [value, format, reduced]);

    return (
        <data ref={ref} value={value} className={className}>
            {format(value)}
        </data>
    );
}
