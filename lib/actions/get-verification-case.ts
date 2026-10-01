"use server";
import {
    CASE_REFERENCE_SEED,
    INFO_REQUESTS_SEED,
} from "@/lib/data/dashboard/work-queue";
import { standIn } from "@/lib/utils/stand-in";
import { verificationCaseSchema } from "@/lib/validations/dashboard";

export const getVerificationCase = async () =>
    standIn(verificationCaseSchema, (workspace) => ({
        id: `case_${workspace.id}`,
        reference: CASE_REFERENCE_SEED,
        state: workspace.verificationState,
        requests:
            workspace.verificationState === "needs_info"
                ? [...INFO_REQUESTS_SEED]
                : [],
    }));
