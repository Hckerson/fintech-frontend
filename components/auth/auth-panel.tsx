import { Checkmark } from "@carbon/icons-react";
import ProductFrame from "@/components/ledgerline/product-frame";
import { AUTH_SHELL_COPY } from "@/lib/data/auth/shell";

interface Props {
    statement: string;
}

export default function AuthPanel({ statement }: Props) {
    return (
        <aside className="border-border bg-background-muted relative hidden h-svh overflow-hidden border-l lg:sticky lg:top-0 lg:flex lg:flex-col lg:gap-12 lg:pt-14 lg:pl-14 xl:pt-20 xl:pl-20">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(60%_60%_at_60%_60%,var(--ledger-glow),transparent_72%)]"
            />
            <div className="relative flex max-w-xl flex-col gap-6 pr-14">
                <p className="text-h4 text-text font-medium tracking-tight text-balance">
                    {statement}
                </p>
                <ul className="flex flex-col gap-2.5">
                    {AUTH_SHELL_COPY.points.map((point) => (
                        <li
                            key={point}
                            className="text-text-secondary flex items-center gap-3 text-sm"
                        >
                            <Checkmark
                                aria-hidden
                                className="text-accent size-4 shrink-0"
                            />
                            {point}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="relative min-h-0 flex-1">
                <div
                    aria-hidden
                    className="product-frame w-5xl max-w-none rounded-xl"
                >
                    <ProductFrame />
                </div>
            </div>
        </aside>
    );
}
