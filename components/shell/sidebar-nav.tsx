import clsx from "clsx";
import type { ReactNode } from "react";
import NavItem from "@/components/shell/nav-item";
import type { ShellNavSection } from "@/lib/types";

interface Props {
    label: string;
    header: ReactNode;
    sections: ShellNavSection[];
    currentId: string | undefined;
}

export default function SidebarNav({
    label,
    header,
    sections,
    currentId,
}: Props) {
    return (
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-3">
            {header}
            <nav aria-label={label} className="flex flex-1 flex-col gap-4">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={clsx(
                            "flex flex-col gap-1",
                            section.pinned && "mt-auto",
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
                            className="flex flex-col gap-1"
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
        </div>
    );
}
