import { useSyncExternalStore } from "react";
import { MINUTE_MS } from "@/lib/workspace/constants";

const subscribe = (onTick: () => void) => {
    const timer = setInterval(onTick, MINUTE_MS);
    return () => clearInterval(timer);
};

const currentMinute = () => Math.floor(new Date().getTime() / MINUTE_MS);

export const useMinute = (): number | null =>
    useSyncExternalStore(subscribe, currentMinute, () => null);
