import { z } from "zod";

const SWITCH_ON = "on";

export const serverEnvSchema = z.object({
    MONEY_MOVEMENT: z
        .unknown()
        .transform((value) => value === SWITCH_ON)
        .catch(false),
});
