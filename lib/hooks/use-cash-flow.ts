import { useQuery } from "@tanstack/react-query";
import { getCashFlow } from "@/lib/actions/get-cash-flow";
import type { CashFlowRange } from "@/lib/types";

export const useCashFlow = (range: CashFlowRange) =>
    useQuery({
        queryKey: ["cash-flow", range],
        queryFn: async () => {
            const result = await getCashFlow(range);
            if (!result.ok) throw new Error(result.message);
            return result.data;
        },
    });
