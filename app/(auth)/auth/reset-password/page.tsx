import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import ResetPasswordStep from "@/components/auth/reset-password-step";
import { checkResetToken } from "@/lib/actions/check-reset-token";
import { RESET_COPY } from "@/lib/data/auth/reset";

interface Props {
    searchParams: Promise<{ token?: string }>;
}

export const metadata: Metadata = {
    title: RESET_COPY.metaTitle,
    robots: { index: false },
    referrer: "no-referrer",
};

export default async function ResetPasswordPage({ searchParams }: Props) {
    const { token } = await searchParams;

    return (
        <AuthShell statement={RESET_COPY.statement}>
            <ResetPasswordStep
                token={token}
                link={await checkResetToken(token)}
            />
        </AuthShell>
    );
}
