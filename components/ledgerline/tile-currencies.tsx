import MotionWrapper from "@/components/wrappers/motion-wrapper";
import { ACCOUNTS_COPY, CURRENCY_ACCOUNTS } from "@/lib/data/ledgerline/features";
import { formatMoney } from "@/lib/ledgerline/money";
import { REVEAL } from "@/lib/ledgerline/constants";

export default function TileCurrencies() {
    return (
        <MotionWrapper
            yOffset={REVEAL.offset}
            duration={REVEAL.seconds}
            className="surface-card flex flex-col gap-8 p-8 lg:col-span-2 lg:row-span-2 lg:p-10"
        >
            <div className="flex max-w-md flex-col gap-3">
                <h3 className="text-2xl font-medium tracking-tight text-text">{ACCOUNTS_COPY.featuredTitle}</h3>
                <p className="text-text-secondary">{ACCOUNTS_COPY.featuredDetail}</p>
            </div>
            <ul className="mt-auto flex flex-col">
                {CURRENCY_ACCOUNTS.map((account) => (
                    <li
                        key={account.id}
                        className="flex items-center justify-between gap-4 border-t border-border py-4 first:border-t-0"
                    >
                        <span className="flex items-center gap-4">
                            <span className="flex size-10 items-center justify-center rounded-full border border-border-dark font-mono text-xs text-accent">
                                {account.code}
                            </span>
                            <span className="text-text-secondary">{account.name}</span>
                        </span>
                        <span className="text-xl font-medium tracking-tight tabular-nums text-text">
                            {formatMoney(account.balanceMinor, account.code)}
                        </span>
                    </li>
                ))}
            </ul>
        </MotionWrapper>
    );
}
