import "server-only";
import { serverEnvSchema } from "@/lib/validations/env";

const env = serverEnvSchema.parse({
    MONEY_MOVEMENT: process.env.MONEY_MOVEMENT,
    LIVE_DATA: process.env.LIVE_DATA,
});

export const serverEnv = {
    moneyMovement: env.MONEY_MOVEMENT,
    liveData: env.LIVE_DATA,
} as const;
