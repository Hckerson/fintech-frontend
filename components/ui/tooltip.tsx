"use client";
import type { ReactNode } from "react";
import { Tooltip as Primitive } from "radix-ui";

interface Props {
    content: ReactNode;
    children: ReactNode;
}

const DELAY_MS = 150;

export default function Tooltip({ content, children }: Props) {
    return (
        <Primitive.Provider delayDuration={DELAY_MS}>
            <Primitive.Root>
                <Primitive.Trigger asChild>{children}</Primitive.Trigger>
                <Primitive.Portal>
                    <Primitive.Content
                        sideOffset={6}
                        collisionPadding={12}
                        className="border-border-dark bg-background-alt text-text-secondary z-(--z-indices-tooltip) max-w-60 rounded-lg border px-3 py-2 text-xs shadow-(--shadows-xl) transition-opacity duration-150 starting:opacity-0"
                    >
                        {content}
                    </Primitive.Content>
                </Primitive.Portal>
            </Primitive.Root>
        </Primitive.Provider>
    );
}
