import type { ReactNode } from "react";
import AuthPanelChart from "@/components/auth/auth-panel-chart";

interface Props {
    statement: string;
    caption: string;
    visual?: ReactNode;
}

export default function AuthPanel({ statement, caption, visual }: Props) {
    return (
        <aside className="border-border bg-background-alt relative hidden h-svh overflow-hidden border-l lg:sticky lg:top-0 lg:flex lg:flex-col lg:gap-8 lg:p-12 xl:p-16">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-1/4 h-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,var(--ledger-glow),transparent_72%)]"
            />
            <div className="relative">{visual}</div>
            <div className="relative -mx-12 min-h-32 flex-1 xl:-mx-16">
                <AuthPanelChart />
            </div>
            <div className="relative flex flex-col gap-5">
                <p className="ledger-title text-text max-w-md">{statement}</p>
                <p className="text-text-muted font-mono text-xs">{caption}</p>
            </div>
        </aside>
    );
}
