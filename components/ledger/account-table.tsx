"use client";
import AccountDirectoryRow from "@/components/ledger/account-directory-row";
import SortHeader from "@/components/ui/sort-header";
import { ACCOUNTS_COPY as COPY } from "@/lib/data/ledger/copy";
import type {
    AccountGroup,
    AccountReveal,
    AccountSortKey,
    AccountsQuery,
} from "@/lib/types";

interface Props {
    groups: AccountGroup[];
    query: AccountsQuery;
    onSort: (key: AccountSortKey) => void;
    reveal: AccountReveal | null;
}

const COLUMNS: {
    key: AccountSortKey;
    align?: "right";
    className?: string;
}[] = [
    { key: "name" },
    { key: "state" },
    { key: "current", align: "right", className: "hidden sm:table-cell" },
    { key: "available", align: "right" },
];

export default function AccountTable({ groups, query, onSort, reveal }: Props) {
    const count = groups.reduce((sum, group) => sum + group.accounts.length, 0);
    const sorted = COPY.sorted(
        COPY.columns[query.sort],
        COPY.directions[query.dir],
        count,
    );

    return (
        <table className="w-full">
            <caption className="sr-only">
                {COPY.panel}. {sorted}
            </caption>
            <thead>
                <tr>
                    {COLUMNS.map(({ key, align, className }) => (
                        <SortHeader
                            key={key}
                            label={COPY.columns[key]}
                            actionLabel={COPY.sortBy(COPY.columns[key])}
                            direction={query.sort === key ? query.dir : null}
                            onSort={() => onSort(key)}
                            align={align}
                            className={className}
                        />
                    ))}
                </tr>
            </thead>
            {groups.map(({ currency, accounts }) => (
                <tbody key={currency}>
                    {groups.length > 1 ? (
                        <tr>
                            <th
                                scope="rowgroup"
                                colSpan={COLUMNS.length}
                                className="figure-label bg-background-muted border-border-light border-b px-4 py-1.5 text-left"
                            >
                                {COPY.group(currency, accounts.length)}
                            </th>
                        </tr>
                    ) : null}
                    {accounts.map((account) => (
                        <AccountDirectoryRow
                            key={account.id}
                            account={account}
                            reveal={reveal}
                        />
                    ))}
                </tbody>
            ))}
        </table>
    );
}
