import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/lib/actions/get-accounts";

export const useAccounts = () =>
    useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const result = await getAccounts();
            if (!result.ok) throw new Error(result.message);
            return result.data;
        },
    });
