import clsx from "clsx";
import { Add } from "@carbon/icons-react";
import type { FaqItem } from "@/lib/types";

interface Props {
    item: FaqItem;
    open: boolean;
    onToggle: () => void;
}

export default function FaqRow({ item, open, onToggle }: Props) {
    const panelId = `faq-${item.id}`;

    return (
        <li className="border-b border-border">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={onToggle}
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-lg font-medium text-text"
            >
                {item.question}
                <Add
                    aria-hidden
                    className={clsx("size-5 shrink-0 text-accent transition-transform duration-500", open && "rotate-45")}
                />
            </button>
            <div id={panelId} className="collapse-grid" data-open={open} inert={!open}>
                <div>
                    <p className="max-w-xl pb-6 text-text-secondary">{item.answer}</p>
                </div>
            </div>
        </li>
    );
}
