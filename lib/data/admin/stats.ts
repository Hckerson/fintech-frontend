import type { StatsPeriod } from "@/lib/types";

export const SIGN_UP_SEED: Record<StatsPeriod, readonly number[]> = {
    day: [41, 38, 52, 47, 29, 33, 18],
    month: [612, 648, 701, 689, 754, 812, 866, 903, 951, 1_024, 1_098, 76],
    year: [0, 0, 1_240, 6_318, 8_452],
};
