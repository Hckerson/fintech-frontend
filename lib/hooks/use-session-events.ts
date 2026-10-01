import { useEffect, useRef } from "react";
import type { SessionEvent } from "@/lib/types";
import { onSessionEvent } from "@/lib/utils/session-events";

export const useSessionEvents = (onEvent: (event: SessionEvent) => void) => {
    const handler = useRef(onEvent);

    useEffect(() => {
        handler.current = onEvent;
    }, [onEvent]);

    useEffect(() => onSessionEvent((event) => handler.current(event)), []);
};
