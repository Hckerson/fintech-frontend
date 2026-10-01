"use client";
import { useState } from "react";
import { Checkmark } from "@carbon/icons-react";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { ROLE_LABELS, SHELL_COPY } from "@/lib/data/shell";
import type { Workspace } from "@/lib/types";
import { WORKSPACE_SEARCH_THRESHOLD } from "@/lib/workspace/constants";

interface Props {
    memberships: readonly Workspace[];
    currentId: string;
    onChoose: (workspace: Workspace) => void;
}

const COPY = SHELL_COPY.workspace;
const byName = new Intl.Collator(DEFAULT_LOCALE);

export default function WorkspaceOptions({
    memberships,
    currentId,
    onChoose,
}: Props) {
    const [filter, setFilter] = useState("");
    const listed = memberships
        .filter(({ name }) =>
            name.toLowerCase().includes(filter.trim().toLowerCase()),
        )
        .sort((a, b) => byName.compare(a.name, b.name));

    return (
        <>
            {memberships.length > WORKSPACE_SEARCH_THRESHOLD ? (
                <input
                    type="search"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    aria-label={COPY.filter}
                    placeholder={COPY.filter}
                    className="border-border bg-background text-text placeholder:text-text-muted focus:border-accent h-9 rounded-md border px-2.5 text-sm focus:outline-none"
                />
            ) : null}
            {listed.map((membership) => {
                const current = membership.id === currentId;
                return (
                    <button
                        key={membership.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={current}
                        onClick={() => onChoose(membership)}
                    >
                        <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate">{membership.name}</span>
                            <span className="text-text-muted text-xs">
                                {ROLE_LABELS[membership.role]}
                                {current ? ` · ${COPY.current}` : ""}
                            </span>
                        </span>
                        {current ? (
                            <Checkmark
                                aria-hidden
                                className="size-4 shrink-0"
                            />
                        ) : null}
                    </button>
                );
            })}
        </>
    );
}
