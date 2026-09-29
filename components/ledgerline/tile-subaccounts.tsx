import { ACCOUNTS_COPY } from "@/lib/data/ledgerline/features";

export default function TileSubaccounts() {
    return (
        <div className="surface-card flex flex-col gap-6 p-8 lg:col-span-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-md flex-col gap-2">
                <h3 className="text-text text-lg font-medium">
                    {ACCOUNTS_COPY.subTitle}
                </h3>
                <p className="text-text-secondary text-sm">
                    {ACCOUNTS_COPY.subDetail}
                </p>
            </div>
            <ul className="flex flex-wrap gap-2">
                {ACCOUNTS_COPY.subAccounts.map((name) => (
                    <li
                        key={name}
                        className="border-border-dark text-text-secondary rounded-full border px-4 py-2 text-sm"
                    >
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
