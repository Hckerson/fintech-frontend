import { useEffect, useState } from "react";

export function useOverdue(active: boolean, delay: number) {
    const [overdue, setOverdue] = useState(false);

    useEffect(() => {
        if (!active) return;
        const timer = setTimeout(() => setOverdue(true), delay);
        return () => {
            clearTimeout(timer);
            setOverdue(false);
        };
    }, [active, delay]);

    return overdue;
}
