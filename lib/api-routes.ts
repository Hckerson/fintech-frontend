export const apiRoutes = {
    session: () => "/api/session",
    register: () => "/api/register",
    passwordReset: () => "/api/password-reset",
    passwordResetConfirm: () => "/api/password-reset/confirm",
    challenge: () => "/api/challenge",
    challengeResend: () => "/api/challenge/resend",
    challengePasskey: () => "/api/challenge/passkey",
} as const;

export const backendRoutes = {
    authPasswordReset: () => "/api/auth/password-reset",
    authPasswordResetCheck: () => "/api/auth/password-reset/check",
    authPasswordResetConfirm: () => "/api/auth/password-reset/confirm",
    authChallenge: () => "/api/auth/challenge",
    authChallengeResend: () => "/api/auth/challenge/resend",
    authChallengePasskey: () => "/api/auth/challenge/passkey",
} as const;
