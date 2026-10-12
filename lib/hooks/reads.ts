import { getAccounts } from "@/lib/actions/get-accounts";
import { getCashPosition } from "@/lib/actions/get-cash-position";
import { getVerificationCase } from "@/lib/actions/get-verification-case";
import { listExports } from "@/lib/actions/list-exports";
import { listTransactions } from "@/lib/actions/list-transactions";
import { queryKeys } from "@/lib/hooks/query-keys";
import type { TransactionQuery } from "@/lib/types";
import { unwrapResult } from "@/lib/utils/query-error";

export const reads = {
    accounts: (workspaceId: string) => ({
        queryKey: queryKeys.accounts.all(workspaceId),
        queryFn: async () => unwrapResult(await getAccounts()),
    }),
    cashPosition: (workspaceId: string) => ({
        queryKey: queryKeys.accounts.cashPosition(workspaceId),
        queryFn: async () => unwrapResult(await getCashPosition()),
    }),
    transactions: (workspaceId: string, query: TransactionQuery) => ({
        queryKey: queryKeys.transactions.list(workspaceId, query),
        queryFn: async () => unwrapResult(await listTransactions(query)),
    }),
    exports: (workspaceId: string) => ({
        queryKey: queryKeys.exports.all(workspaceId),
        queryFn: async () => unwrapResult(await listExports()),
    }),
    verificationCase: (workspaceId: string) => ({
        queryKey: queryKeys.verificationCase(workspaceId),
        queryFn: async () => unwrapResult(await getVerificationCase()),
    }),
};
