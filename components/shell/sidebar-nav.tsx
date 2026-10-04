"use client";
import clsx from "clsx";
import { LayoutGroup } from "motion/react";
import { useId, type ReactNode } from "react";
import NavItem from "@/components/shell/nav-item";
import type { ShellNavSection } from "@/lib/types";

interface Props {
    label: string;
    header: ReactNode;
    footer?: ReactNode;
    sections: ShellNavSection[];
    currentId: string | undefined;
}

export default function SidebarNav({
    label,
    header,
    footer,
    sections,
    currentId,
}: Props) {
    const group = useId();
    const firstPinned = sections.findIndex(({ pinned }) => pinned);

    return (
        <LayoutGroup id={group}>
            <div className="flex h-full flex-col">
                <div className="border-border flex min-h-(--shell-bar) shrink-0 flex-col justify-center border-b px-3 py-1">
                    {header}
                </div>
                <nav
                    aria-label={label}
                    className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pt-4 pb-3"
                >
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            className={clsx(
                                "flex flex-col gap-1.5",
                                index === firstPinned &&
                                    "border-border mt-auto border-t pt-3",
                                index > firstPinned &&
                                    firstPinned >= 0 &&
                                    "-mt-3.5",
                            )}
                        >
                            {section.showLabel ? (
                                <p
                                    aria-hidden
                                    className="micro-label text-text-muted px-2.5"
                                >
                                    {section.label}
                                </p>
                            ) : null}
                            <ul
                                aria-label={section.label}
                                className="flex flex-col gap-0.5"
                            >
                                {section.items.map((item) => (
                                    <li key={item.id}>
                                        <NavItem
                                            {...item}
                                            current={item.id === currentId}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
                {footer ? (
                    <div className="border-border flex h-12 shrink-0 items-center border-t px-4">
                        {footer}
                    </div>
                ) : null}
            </div>
        </LayoutGroup>
    );
}
