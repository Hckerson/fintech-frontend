import {
    ACCOUNTS_COPY,
    CURRENCY_ACCOUNTS,
} from "@/lib/data/ledgerline/features";
import { formatMoney } from "@/lib/ledgerline/money";

export default function TileCurrencies() {
    return (
        <div className="surface-card flex flex-col gap-8 p-8 lg:col-span-2 lg:row-span-2 lg:p-10">
            <div className="flex max-w-md flex-col gap-3">
                <h3 className="text-text text-2xl font-medium tracking-tight">
                    {ACCOUNTS_COPY.featuredTitle}
                </h3>
                <p className="text-text-secondary">
                    {ACCOUNTS_COPY.featuredDetail}
                </p>
            </div>
            <ul className="mt-auto flex flex-col">
                {CURRENCY_ACCOUNTS.map((account) => (
                    <li
                        key={account.id}
                        className="border-border flex items-center justify-between gap-4 border-t py-4 first:border-t-0"
                    >
                        <span className="flex items-center gap-4">
                            <span className="border-border-dark text-text-secondary flex size-10 items-center justify-center rounded-full border font-mono text-xs">
                                {account.code}
                            </span>
                            <span className="text-text-secondary">
                                {account.name}
                            </span>
                        </span>
                        <span className="text-text text-xl font-medium tracking-tight tabular-nums">
                            {formatMoney(account.balanceMinor, account.code)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
