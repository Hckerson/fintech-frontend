"use client";
import { Fragment } from "react";
import { motion } from "motion/react";
import { REVEAL_EASE, WORD_DURATION, WORD_STAGGER } from "@/lib/ledgerline/constants";

const TAGS = { h2: motion.h2, h3: motion.h3, p: motion.p } as const;

interface Props {
    text: string;
    as?: keyof typeof TAGS;
    id?: string;
    className?: string;
}

const word = {
    hidden: { y: "110%" },
    shown: { y: "0%", transition: { duration: WORD_DURATION, ease: REVEAL_EASE } },
};

export default function RevealWords({ text, as = "h2", id, className }: Props) {
    const Tag = TAGS[as];

    return (
        <Tag
            id={id}
            className={className}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: "-8%" }}
            transition={{ staggerChildren: WORD_STAGGER }}
        >
            {text.split(" ").map((part, index) => (
                <Fragment key={`${part}-${index}`}>
                    <span className="word-mask">
                        <motion.span className="word" variants={word}>
                            {part}
                        </motion.span>
                    </span>{" "}
                </Fragment>
            ))}
        </Tag>
    );
}
