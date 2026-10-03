export const WORKSPACE_ROLES = [
    "owner",
    "finance",
    "accountant",
    "viewer",
] as const;

export const CAPABILITY_ROLES = {
    managePayees: ["owner", "finance"],
    transferMoney: ["owner", "finance"],
    viewDashboard: WORKSPACE_ROLES,
    viewAccounts: WORKSPACE_ROLES,
    revealAccountNumber: ["owner", "finance", "accountant"],
    viewTransactions: WORKSPACE_ROLES,
    comparePeriods: ["owner", "finance", "accountant"],
    downloadStatements: ["owner", "finance", "accountant"],
    manageExports: ["owner", "finance", "accountant"],
    receiveNotifications: WORKSPACE_ROLES,
    secureMessages: ["owner", "finance", "accountant"],
    editOwnProfile: WORKSPACE_ROLES,
    editWorkspaceSettings: ["owner"],
    manageAlertRules: ["owner", "finance"],
    completeVerification: ["owner"],
} as const satisfies Record<
    string,
    readonly (typeof WORKSPACE_ROLES)[number][]
>;
