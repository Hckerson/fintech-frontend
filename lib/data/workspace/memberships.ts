import type { Workspace } from "@/lib/types";
import { DEFAULT_TIME_ZONE } from "@/lib/workspace/constants";

export const MEMBERSHIPS: readonly Workspace[] = [
    {
        id: "ws_northwind",
        name: "Northwind Ltd",
        role: "owner",
        verificationState: "approved",
        timeZone: DEFAULT_TIME_ZONE,
    },
    {
        id: "ws_juniper",
        name: "Juniper Labs",
        role: "owner",
        verificationState: "needs_info",
        timeZone: DEFAULT_TIME_ZONE,
    },
    {
        id: "ws_harbour",
        name: "Harbour & Finch LLP",
        role: "finance",
        verificationState: "needs_info",
        timeZone: DEFAULT_TIME_ZONE,
    },
    {
        id: "ws_calder",
        name: "Calder Studio",
        role: "accountant",
        verificationState: "approved",
        timeZone: DEFAULT_TIME_ZONE,
    },
    {
        id: "ws_oakfield",
        name: "Oakfield Trading",
        role: "viewer",
        verificationState: "approved",
        timeZone: DEFAULT_TIME_ZONE,
    },
];

export const NOTIFICATION_COUNT_SEED = { unread: 3 } as const;
