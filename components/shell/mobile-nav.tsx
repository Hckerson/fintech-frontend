"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { Close, Menu as MenuIcon } from "@carbon/icons-react";
import { SHELL_COPY } from "@/lib/data/shell";

interface Props {
    children: ReactNode;
}

const CONTROL =
    "border-border text-text focus-visible:outline-accent inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border focus-visible:outline-2";

export default function MobileNav({ children }: Props) {
    const pathname = usePathname();
    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => dialog.current?.close(), [pathname]);

    return (
        <>
            <button
                type="button"
                aria-label={SHELL_COPY.openNav}
                onClick={() => dialog.current?.showModal()}
                className={`${CONTROL} lg:hidden`}
            >
                <MenuIcon aria-hidden className="size-5" />
            </button>
            <dialog
                ref={dialog}
                aria-label={SHELL_COPY.primaryNav}
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        event.currentTarget.close();
                    }
                }}
                className="border-border bg-background-alt text-text backdrop:bg-overlay m-0 h-svh max-h-none w-72 max-w-[85vw] border-r p-0"
            >
                <div className="flex h-full flex-col">
                    <div className="flex justify-end px-2 pt-2">
                        <button
                            type="button"
                            aria-label={SHELL_COPY.closeNav}
                            onClick={() => dialog.current?.close()}
                            className={CONTROL}
                        >
                            <Close aria-hidden className="size-5" />
                        </button>
                    </div>
                    <div className="min-h-0 flex-1">{children}</div>
                </div>
            </dialog>
        </>
    );
}
