"use server";
import { MEMBERSHIPS } from "@/lib/data/workspace/memberships";
import { standIn } from "@/lib/utils/stand-in";
import { workspaceListSchema } from "@/lib/validations/workspace";

export const listWorkspaces = async () =>
    standIn(workspaceListSchema, () => [...MEMBERSHIPS]);
