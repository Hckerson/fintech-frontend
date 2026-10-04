import { useQuery } from "@tanstack/react-query";
import { readOptions } from "@/lib/hooks/read-options";
import { reads } from "@/lib/hooks/reads";
import { useWorkspace } from "@/lib/hooks/use-workspace";

export const useExports = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const { workspace } = useWorkspace();

    return useQuery({
        ...reads.exports(workspace.id),
        enabled,
        ...readOptions("live"),
    });
};
