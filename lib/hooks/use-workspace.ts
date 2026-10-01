import { useContext } from "react";
import { WorkspaceContext } from "@/lib/workspace/context";

export const useWorkspace = () => {
    const value = useContext(WorkspaceContext);
    if (!value) {
        throw new Error("useWorkspace must be used inside WorkspaceProvider");
    }
    return value;
};
