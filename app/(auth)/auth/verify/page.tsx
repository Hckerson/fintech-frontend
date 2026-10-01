import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import VerifyStep from "@/components/auth/verify-step";
import { VERIFY_COPY } from "@/lib/data/auth/verify";
import { internalPath } from "@/lib/utils/internal-path";

interface Props {
    searchParams: Promise<{ challenge?: string; next?: string }>;
}

export const metadata: Metadata = {
    title: VERIFY_COPY.metaTitle,
    robots: { index: false },
};

export default async function VerifyPage({ searchParams }: Props) {
    const { challenge, next } = await searchParams;

    return (
        <AuthShell statement={VERIFY_COPY.statement}>
            <VerifyStep challenge={challenge} next={internalPath(next)} />
        </AuthShell>
    );
}
