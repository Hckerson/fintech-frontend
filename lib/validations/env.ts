import { z } from "zod";

const SWITCH_ON = "on";

const flag = z
    .unknown()
    .transform((value) => value === SWITCH_ON)
    .catch(false);

export const serverEnvSchema = z.object({
    LIVE_DATA: flag,
    MONEY_MOVEMENT: flag,
});
