"use server";
import { TRANSACTIONS_SEED } from "@/lib/data/dashboard/transactions";
import type { TransactionQuery } from "@/lib/types";
import { pendingGroups } from "@/lib/utils/pending-groups";
import { standIn } from "@/lib/utils/stand-in";
import {
    transactionListSchema,
    transactionQuerySchema,
} from "@/lib/validations/dashboard";

export const listTransactions = async (query: TransactionQuery) =>
    standIn(transactionListSchema, () => {
        const { limit, status } = transactionQuerySchema.parse(query);

        return {
            items: TRANSACTIONS_SEED.filter(
                (transaction) => !status || transaction.status === status,
            ).slice(0, limit),
            pending: pendingGroups(TRANSACTIONS_SEED),
        };
    });
