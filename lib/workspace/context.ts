import { createContext } from "react";
import type { WorkspaceContextValue } from "@/lib/types";

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
    null,
);
