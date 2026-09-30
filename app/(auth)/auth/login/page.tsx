import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import { ViewOff } from "@carbon/icons-react";
import AuthAccountChip from "@/components/auth/auth-account-chip";
import SignInForm from "@/components/auth/sign-in-form";
import { SIGN_IN_COPY } from "@/lib/data/auth/sign-in";
import { internalPath } from "@/lib/utils/internal-path";

interface Props {
    searchParams: Promise<{ next?: string }>;
}

export const metadata: Metadata = { title: SIGN_IN_COPY.metaTitle };

export default async function SignInPage({ searchParams }: Props) {
    const { next } = await searchParams;

    return (
        <AuthShell
            statement={SIGN_IN_COPY.statement}
            visual={
                <AuthAccountChip
                    {...SIGN_IN_COPY.account}
                    icon={<ViewOff className="size-4" />}
                />
            }
        >
            <SignInForm next={internalPath(next)} />
        </AuthShell>
    );
}
