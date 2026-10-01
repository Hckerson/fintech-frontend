"use server";
import { z } from "zod";
import { readStamped } from "@/lib/api-server";
import { routes } from "@/lib/contract/routes";
import { accountResponseDtoSchema } from "@/lib/contract/schemas";
import type { AccountList, ActionResult } from "@/lib/types";

export const getAccounts = async (): Promise<ActionResult<AccountList>> => {
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
