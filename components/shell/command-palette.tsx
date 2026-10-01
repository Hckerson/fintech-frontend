"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Search } from "@carbon/icons-react";
import CommandResults from "@/components/shell/command-results";
import { SHELL_COPY } from "@/lib/data/shell";
import type { PaletteCommand } from "@/lib/types";
import { queryString } from "@/lib/utils/query-string";

interface Props {
    commands: readonly PaletteCommand[];
    searchAllHref?: string;
    onClose: () => void;
}

const COPY = SHELL_COPY.search;

export default function CommandPalette({
    commands,
    searchAllHref,
    onClose,
}: Props) {
    const router = useRouter();
    const dialog = useRef<HTMLDialogElement>(null);
    const listId = useId();
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const term = query.trim().toLowerCase();
    const results = commands.filter(({ label }) =>
        label.toLowerCase().includes(term),
    );
    const chosen = results[Math.min(active, results.length - 1)];

    useEffect(() => {
        if (!dialog.current?.open) dialog.current?.showModal();
    }, []);

    const open = (href: string) => {
        router.push(href);
        dialog.current?.close();
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && chosen) open(chosen.href);
        if (!results.length) return;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((chosenIndex) => (chosenIndex + 1) % results.length);
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive(
                (chosenIndex) =>
                    (chosenIndex - 1 + results.length) % results.length,
            );
        }
    };

    return (
        <dialog
            ref={dialog}
            aria-label={COPY.title}
            onClose={onClose}
            onCancel={(event) => {
                if (!query) return;
                event.preventDefault();
                setQuery("");
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    event.currentTarget.close();
                }
            }}
            className="border-border-dark bg-background-alt text-text backdrop:bg-overlay mx-auto mt-24 w-[min(100%-2rem,36rem)] rounded-xl border p-0"
        >
            <div className="flex flex-col">
                <label className="border-border flex items-center gap-3 border-b px-4">
                    <Search aria-hidden className="text-text-muted size-4" />
                    <span className="sr-only">{COPY.title}</span>
                    <input
                        role="combobox"
                        aria-expanded
                        aria-controls={listId}
                        aria-autocomplete="list"
                        aria-activedescendant={
                            chosen ? `${listId}-${chosen.id}` : undefined
                        }
                        autoFocus
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setActive(0);
                        }}
                        onKeyDown={onKeyDown}
                        placeholder={COPY.placeholder}
                        className="text-text placeholder:text-text-muted h-12 flex-1 bg-transparent text-sm focus:outline-none"
                    />
                </label>
                <CommandResults
                    id={listId}
                    results={results}
                    chosen={chosen}
                    onOpen={open}
                />
                {results.length === 0 ? (
                    <p className="text-text-secondary px-4 pb-4 text-sm">
                        {COPY.none}{" "}
                        {searchAllHref ? (
                            <Link
                                href={`${searchAllHref}${queryString({ q: query.trim() })}`}
                                onClick={() => dialog.current?.close()}
                                className="text-accent underline-offset-4 hover:underline"
                            >
                                {COPY.searchAll}
                            </Link>
                        ) : null}
                    </p>
                ) : null}
                <p role="status" className="sr-only">
                    {COPY.results(results.length)}
                </p>
            </div>
        </dialog>
    );
}
