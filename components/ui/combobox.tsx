"use client";
import clsx from "clsx";
import { useState, type ReactNode } from "react";
import { Command } from "cmdk";
import { Popover as Primitive } from "radix-ui";
import { Checkmark, ChevronDown, Search } from "@carbon/icons-react";

interface Option {
    id: string;
    label: string;
    detail?: string;
    leading?: ReactNode;
}

interface Props {
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    options: readonly Option[];
    value: string;
    placeholder: string;
    searchPlaceholder: string;
    emptyText: string;
    onChange: (id: string) => void;
}

export default function Combobox({
    options,
    value,
    placeholder,
    searchPlaceholder,
    emptyText,
    onChange,
    ...control
}: Props) {
    const [open, setOpen] = useState(false);
    const selected = options.find((option) => option.id === value);

    return (
        <Primitive.Root open={open} onOpenChange={setOpen}>
            <Primitive.Trigger
                {...control}
                role="combobox"
                aria-expanded={open}
                className="border-border bg-background text-text focus-visible:ring-accent/40 focus:border-accent aria-invalid:border-error flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2"
            >
                {selected?.leading}
                <span className="flex min-w-0 flex-1 flex-col">
                    <span
                        className={clsx(
                            "truncate",
                            selected ? "font-medium" : "text-text-muted",
                        )}
                    >
                        {selected?.label ?? placeholder}
                    </span>
                    {selected?.detail ? (
                        <span className="text-text-muted truncate text-xs">
                            {selected.detail}
                        </span>
                    ) : null}
                </span>
                <ChevronDown
                    aria-hidden
                    className="text-text-muted size-4 shrink-0"
                />
            </Primitive.Trigger>
            <Primitive.Portal>
                <Primitive.Content
                    align="start"
                    sideOffset={6}
                    collisionPadding={12}
                    className="border-border-dark bg-background-alt z-(--z-indices-popover) w-(--radix-popover-trigger-width) rounded-lg border shadow-(--shadows-xl) transition-opacity duration-150 starting:opacity-0"
                >
                    <Command>
                        <div className="border-border flex items-center gap-2 border-b px-3">
                            <Search
                                aria-hidden
                                className="text-text-muted size-4 shrink-0"
                            />
                            <Command.Input
                                placeholder={searchPlaceholder}
                                className="text-text placeholder:text-text-muted h-10 w-full bg-transparent text-sm focus:outline-none"
                            />
                        </div>
                        <Command.List className="max-h-64 overflow-y-auto p-1">
                            <Command.Empty className="text-text-muted px-3 py-4 text-sm">
                                {emptyText}
                            </Command.Empty>
                            {options.map((option) => (
                                <Command.Item
                                    key={option.id}
                                    value={`${option.label} ${option.detail ?? ""}`}
                                    onSelect={() => {
                                        onChange(option.id);
                                        setOpen(false);
                                    }}
                                    className="data-[selected=true]:bg-background-muted flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm"
                                >
                                    {option.leading}
                                    <span className="flex min-w-0 flex-1 flex-col">
                                        <span className="text-text truncate">
                                            {option.label}
                                        </span>
                                        {option.detail ? (
                                            <span className="text-text-muted truncate text-xs">
                                                {option.detail}
                                            </span>
                                        ) : null}
                                    </span>
                                    {option.id === value ? (
                                        <Checkmark
                                            aria-hidden
                                            className="text-accent size-4 shrink-0"
                                        />
                                    ) : null}
                                </Command.Item>
                            ))}
                        </Command.List>
                    </Command>
                </Primitive.Content>
            </Primitive.Portal>
        </Primitive.Root>
    );
}
