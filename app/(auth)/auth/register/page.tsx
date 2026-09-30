import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import AuthAccountChip from "@/components/auth/auth-account-chip";
import RegisterForm from "@/components/auth/register-form";
import { REGISTER_COPY } from "@/lib/data/auth/register";
import { internalPath } from "@/lib/utils/internal-path";

interface Props {
    searchParams: Promise<{ next?: string }>;
}

export const metadata: Metadata = { title: REGISTER_COPY.metaTitle };

export default async function RegisterPage({ searchParams }: Props) {
    const { next } = await searchParams;

    return (
        <AuthShell
            statement={REGISTER_COPY.statement}
            visual={<AuthAccountChip {...REGISTER_COPY.account} />}
        >
            <RegisterForm next={internalPath(next)} />
        </AuthShell>
    );
}
