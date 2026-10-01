import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { FORGOT_COPY } from "@/lib/data/auth/forgot";

export const metadata: Metadata = { title: FORGOT_COPY.metaTitle };

export default function ForgotPasswordPage() {
    return (
        <AuthShell statement={FORGOT_COPY.statement}>
            <ForgotPasswordForm />
        </AuthShell>
    );
}
