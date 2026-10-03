"use server";
import { z } from "zod";
import { readStamped } from "@/lib/api-server";
import { routes } from "@/lib/contract/routes";
import { accountResponseDtoSchema } from "@/lib/contract/schemas";
import { ACCOUNTS_SEED } from "@/lib/data/ledger/accounts";
import type { AccountList, ActionResult } from "@/lib/types";
import { serverEnv } from "@/lib/utils/server-env";
import { standIn } from "@/lib/utils/stand-in";
import { accountListSchema } from "@/lib/validations/dashboard";

const live = async (): Promise<ActionResult<AccountList>> => {
    const result = await readStamped(
        routes.accountsFindAll(),
        z.array(accountResponseDtoSchema),
    );
    return result.ok
        ? {
              ok: true,
              data: { items: result.data.data, asOf: result.data.asOf },
          }
        : result;
};

export const getAccounts = async (): Promise<ActionResult<AccountList>> =>
    serverEnv.liveData
        ? live()
        : standIn(accountListSchema, () => ({
              items: [...ACCOUNTS_SEED],
              asOf: new Date().toISOString(),
          }));
