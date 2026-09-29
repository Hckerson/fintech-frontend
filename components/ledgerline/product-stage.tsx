"use client";
import type { Ref } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import ProductFrame from "@/components/ledgerline/product-frame";
import { useDampedPointer } from "@/lib/hooks/use-damped-pointer";
import {
    FRAME_MOTION,
    HERO_CUES,
    REVEAL_EASE,
} from "@/lib/ledgerline/constants";

interface Props {
    ref: Ref<HTMLDivElement>;
    progress: MotionValue<number>;
}

export default function ProductStage({ ref, progress }: Props) {
    const pointer = useDampedPointer();
    const rotateX = useTransform(progress, [0, 1], [...FRAME_MOTION.tilt]);
    const scale = useTransform(progress, [0, 1], [...FRAME_MOTION.scale]);
    const rotateY = useTransform(
        pointer.x,
        [-1, 1],
        [-FRAME_MOTION.pointerTilt, FRAME_MOTION.pointerTilt],
    );

    return (
        <motion.div
            ref={ref}
            className="product-stage relative mx-auto w-full max-w-6xl"
            initial={{ opacity: 0, y: FRAME_MOTION.enter }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: FRAME_MOTION.enterSeconds,
                delay: HERO_CUES.frame,
                ease: REVEAL_EASE,
            }}
        >
            <motion.div
                className="product-frame rounded-xl"
                style={{ rotateX, rotateY, scale }}
            >
                <ProductFrame />
            </motion.div>
        </motion.div>
    );
}
