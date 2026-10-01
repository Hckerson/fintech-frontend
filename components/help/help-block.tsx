import clsx from "clsx";
import { HELP_COPY } from "@/lib/data/help/copy";
import type { HelpBlock as Block } from "@/lib/types";

interface Props {
    block: Block;
}

export default function HelpBlock({ block }: Props) {
    switch (block.kind) {
        case "p":
            return <p>{block.text}</p>;
        case "list":
            return (
                <ul className="flex flex-col gap-2">
                    {block.items.map((item) => (
                        <li key={item} className="flex gap-3">
                            <span
                                aria-hidden
                                className="bg-border-dark mt-[0.8em] h-px w-3 shrink-0"
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            );
        case "steps":
            return (
                <ol className="border-border marker:text-accent list-decimal border-b pl-6 marker:font-mono marker:text-sm">
                    {block.items.map((item) => (
                        <li
                            key={item}
                            className="border-border text-text border-t py-3 pl-3"
                        >
                            {item}
                        </li>
                    ))}
                </ol>
            );
        case "note":
            return (
                <aside
                    className={clsx(
                        "bg-background-alt border-l-2 px-5 py-4",
                        block.severity === "warning"
                            ? "border-warning"
                            : "border-border-dark",
                    )}
                >
                    <strong className="text-text font-medium">
                        {HELP_COPY.severity[block.severity]}:{" "}
                    </strong>
                    {block.text}
                </aside>
            );
    }
}
