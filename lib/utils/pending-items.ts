import { EXPORTS_ROUTE } from "@/lib/workspace/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type {
    ExportJob,
    PendingGroup,
    PendingItem,
    PendingItemKind,
    VerificationCase,
    WorkspaceRole,
} from "@/lib/types";
import { roleCan } from "@/lib/utils/permissions";
import {
    onboardingStepRoute,
    pendingTransactionsRoute,
} from "@/lib/workspace/constants";

interface Sources {
    role: WorkspaceRole;
    groups?: readonly PendingGroup[];
    exports?: readonly ExportJob[];
    verification?: VerificationCase;
}

const COPY = DASHBOARD_COPY.pending;

const URGENCY: Record<PendingItemKind, number> = {
    export_failed: 0,
    verification_request: 0,
    export_ready: 1,
    pending_transactions: 2,
};

const exportItems = (jobs: readonly ExportJob[]): PendingItem[] =>
    jobs.flatMap((job): PendingItem[] =>
        job.state === "ready" || job.state === "failed"
            ? [
                  {
                      id: job.id,
                      kind:
                          job.state === "ready"
                              ? "export_ready"
                              : "export_failed",
                      title:
                          job.state === "ready"
                              ? COPY.exportReady
                              : COPY.exportFailed,
                      detail: job.label,
                      href: EXPORTS_ROUTE,
                      severity: job.state === "ready" ? "positive" : "problem",
                      at: job.updatedAt,
                  },
              ]
            : [],
    );

export const pendingItems = ({
    role,
    groups = [],
    exports = [],
    verification,
}: Sources): PendingItem[] => {
    const owner = roleCan(role, "completeVerification");
    const informed = owner || roleCan(role, "manageAlertRules");

    const requests: PendingItem[] =
        informed && verification?.state === "needs_info"
            ? verification.requests.map((request) => ({
                  id: request.id,
                  kind: "verification_request",
                  title: COPY.verification,
                  detail: request.message,
                  href: owner ? onboardingStepRoute(request.fieldRef) : null,
                  severity: "attention",
                  at: request.createdAt,
              }))
            : [];

    const transactions: PendingItem[] = groups.map((group) => ({
        id: `${group.accountId}:${group.total.currency}`,
        kind: "pending_transactions",
        title: COPY.transactions(group.count, group.accountName),
        detail: COPY.provisional,
        amount: group.total,
        href: pendingTransactionsRoute(group.accountId),
        severity: "attention",
        at: group.oldestAt,
    }));

    return [
        ...requests,
        ...(roleCan(role, "manageExports") ? exportItems(exports) : []),
        ...transactions,
    ].sort(
        (a, b) => URGENCY[a.kind] - URGENCY[b.kind] || a.at.localeCompare(b.at),
    );
};
