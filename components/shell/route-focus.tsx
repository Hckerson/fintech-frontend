"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { MAIN_CONTENT_ID } from "@/lib/constants";

export default function RouteFocus() {
    const pathname = usePathname();
    const previous = useRef(pathname);

    useEffect(() => {
        if (previous.current === pathname) return;
        previous.current = pathname;
        document.querySelector<HTMLElement>(`#${MAIN_CONTENT_ID} h1`)?.focus();
    }, [pathname]);

    return null;
}
