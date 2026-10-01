import clsx from "clsx";
import { SHELL_COPY } from "@/lib/data/shell";
import type { PaletteCommand } from "@/lib/types";

interface Props {
    id: string;
    results: readonly PaletteCommand[];
    chosen: PaletteCommand | undefined;
    onOpen: (href: string) => void;
}

export default function CommandResults({ id, results, chosen, onOpen }: Props) {
    const groups = [...new Set(results.map(({ group }) => group))];

    return (
        <div
            id={id}
            role="listbox"
            aria-label={SHELL_COPY.search.title}
            className="flex max-h-80 flex-col gap-2 overflow-y-auto p-2"
        >
            {groups.map((group) => (
                <div key={group} role="group" aria-label={group}>
                    <p
                        aria-hidden
                        className="micro-label text-text-muted px-2.5 py-1"
                    >
                        {group}
                    </p>
                    {results
                        .filter((command) => command.group === group)
                        .map((command) => (
                            <div
                                key={command.id}
                                id={`${id}-${command.id}`}
                                role="option"
                                aria-selected={command === chosen}
                                onClick={() => onOpen(command.href)}
                                className={clsx(
                                    "cursor-pointer rounded-md px-2.5 py-2 text-sm",
                                    command === chosen
                                        ? "bg-background-muted text-text"
                                        : "text-text-secondary hover:text-text",
                                )}
                            >
                                {command.label}
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
}
