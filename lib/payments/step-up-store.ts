import "server-only";
import {
    STEP_UP_GRANT_SECONDS,
    STEP_UP_LOCK_SECONDS,
    STEP_UP_MAX_ATTEMPTS,
} from "@/lib/payments/constants";
import type { StepUpPurpose } from "@/lib/types";

const MS_PER_SECOND = 1_000;

const grants = new Map<string, number>();

const failures = new Map<string, number[]>();

const now = () => new Date().getTime();

const grantKey = (userId: string, purpose: StepUpPurpose) =>
    `${userId}:${purpose}`;

const recentFailures = (userId: string) =>
    (failures.get(userId) ?? []).filter(
        (at) => now() - at < STEP_UP_LOCK_SECONDS * MS_PER_SECOND,
    );

export const hasGrant = (userId: string, purpose: StepUpPurpose) =>
    (grants.get(grantKey(userId, purpose)) ?? 0) > now();

export const giveGrant = (userId: string, purpose: StepUpPurpose) => {
    grants.set(
        grantKey(userId, purpose),
        now() + STEP_UP_GRANT_SECONDS * MS_PER_SECOND,
    );
    failures.delete(userId);
};

export const attemptsLeft = (userId: string) =>
    STEP_UP_MAX_ATTEMPTS - recentFailures(userId).length;

export const recordFailure = (userId: string) => {
    failures.set(userId, [...recentFailures(userId), now()]);
    return attemptsLeft(userId);
};
