"use server";
import { z } from "zod";
import { readEnvelope } from "@/lib/api-server";
import { routes } from "@/lib/contract/routes";
import { accountResponseDtoSchema } from "@/lib/contract/schemas";

export const getAccounts = async () =>
    readEnvelope(routes.accountsFindAll(), z.array(accountResponseDtoSchema));
