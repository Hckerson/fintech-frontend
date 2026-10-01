"use server";
import { EXPORTS_SEED } from "@/lib/data/dashboard/work-queue";
import { standIn } from "@/lib/utils/stand-in";
import { exportListSchema } from "@/lib/validations/dashboard";

export const listExports = async () =>
    standIn(exportListSchema, () => [...EXPORTS_SEED]);
