import "server-only";
import { serverEnvSchema } from "@/lib/validations/env";

const env = serverEnvSchema.parse({
    MONEY_MOVEMENT: process.env.MONEY_MOVEMENT,
});

export const serverEnv = { moneyMovement: env.MONEY_MOVEMENT } as const;
