import clsx from "clsx";
import RevealWords from "@/components/wrappers/reveal-words";

interface Props {
    id: string;
    eyebrow: string;
    title: string;
    lead?: string;
    align?: "start" | "center";
    className?: string;
}

export default function SectionHeading({
    id,
    eyebrow,
    title,
    lead,
    align = "start",
    className,
}: Props) {
    return (
        <header
            className={clsx(
                "flex flex-col gap-4",
                align === "center"
                    ? "mx-auto max-w-2xl items-center text-center"
                    : "max-w-xl",
                className,
            )}
        >
            <p className="text-text-muted font-mono text-xs tracking-[0.18em] uppercase">
                {eyebrow}
            </p>
            <RevealWords id={id} text={title} className="ledger-title" />
            {lead && <p className="text-text-secondary text-lg">{lead}</p>}
        </header>
    );
}
