import { HELP_COPY } from "@/lib/data/help/copy";

export default function HelpHeader() {
    return (
        <header className="flex max-w-2xl flex-col gap-5">
            <p className="text-text-muted font-mono text-xs tracking-[0.18em] uppercase">
                {HELP_COPY.eyebrow}
            </p>
            <h1 className="ledger-display text-text">{HELP_COPY.title}</h1>
            <p className="text-text-secondary text-lg">{HELP_COPY.lead}</p>
        </header>
    );
}
