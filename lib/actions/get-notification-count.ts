"use server";
import { NOTIFICATION_COUNT_SEED } from "@/lib/data/workspace/memberships";
import { standIn } from "@/lib/utils/stand-in";
import { notificationCountSchema } from "@/lib/validations/workspace";

export const getNotificationCount = async () =>
    standIn(notificationCountSchema, () => NOTIFICATION_COUNT_SEED);
