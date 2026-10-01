import type { SessionEvent } from "@/lib/types";
import { SESSION_CHANNEL } from "@/lib/workspace/constants";

export const announceSession = (event: SessionEvent) => {
    const channel = new BroadcastChannel(SESSION_CHANNEL);
    channel.postMessage(event);
    channel.close();
};

export const onSessionEvent = (listener: (event: SessionEvent) => void) => {
    const channel = new BroadcastChannel(SESSION_CHANNEL);
    channel.onmessage = (message: MessageEvent<SessionEvent>) =>
        listener(message.data);
    return () => channel.close();
};
