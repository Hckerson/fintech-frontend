"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import ProductFrame from "@/components/ledgerline/product-frame";
import { useDampedPointer } from "@/lib/hooks/use-damped-pointer";
import { FRAME_MOTION, HERO_CUES, REVEAL_EASE, SCROLL_SPRING } from "@/lib/ledgerline/constants";

export default function ProductStage() {
    const ref = useRef<HTMLDivElement>(null);
    const pointer = useDampedPointer();
    const { scrollYProgress } = useScroll({ target: ref, offset: [...FRAME_MOTION.offset] });
    const progress = useSpring(scrollYProgress, SCROLL_SPRING);
    const rotateX = useTransform(progress, [0, 1], [...FRAME_MOTION.tilt]);
    const scale = useTransform(progress, [0, 1], [...FRAME_MOTION.scale]);
    const rotateY = useTransform(pointer.x, [-1, 1], [-FRAME_MOTION.pointerTilt, FRAME_MOTION.pointerTilt]);

    return (
        <motion.div
            ref={ref}
            className="product-stage relative mx-auto w-full max-w-6xl"
            initial={{ opacity: 0, y: FRAME_MOTION.enter }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: FRAME_MOTION.enterSeconds, delay: HERO_CUES.frame, ease: REVEAL_EASE }}
        >
            <motion.div className="product-frame rounded-xl" style={{ rotateX, rotateY, scale }}>
                <ProductFrame />
            </motion.div>
        </motion.div>
    );
}
