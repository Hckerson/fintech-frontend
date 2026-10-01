"use server";
import { readEnvelope } from "@/lib/api-server";
import { routes } from "@/lib/contract/routes";
import { userResponseDtoSchema } from "@/lib/contract/schemas";

export const getMe = async () =>
    readEnvelope(routes.usersGetMe(), userResponseDtoSchema);
