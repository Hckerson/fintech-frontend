"use client";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Popover as Primitive } from "radix-ui";

interface Props {
    label: string;
    trigger: ReactNode;
    align?: "start" | "end";
    triggerClassName?: string;
    children: ReactNode;
}

export default function Popover({
    label,
    trigger,
    align = "start",
    triggerClassName,
    children,
}: Props) {
    return (
        <Primitive.Root>
            <Primitive.Trigger
                aria-label={label}
                className={clsx(
                    "focus-visible:outline-accent cursor-pointer focus-visible:outline-2",
                    triggerClassName,
                )}
            >
                {trigger}
            </Primitive.Trigger>
            <Primitive.Portal>
                <Primitive.Content
                    align={align}
                    sideOffset={8}
                    collisionPadding={12}
                    aria-label={label}
                    className="border-border-dark bg-background-alt z-(--z-indices-popover) flex flex-col gap-1 rounded-lg border px-3 py-2 text-left shadow-(--shadows-xl) transition-opacity duration-150 focus:outline-none starting:opacity-0"
                >
                    {children}
                </Primitive.Content>
            </Primitive.Portal>
        </Primitive.Root>
    );
}
