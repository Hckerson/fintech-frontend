"use client";
import Tabs from "@/components/ui/tabs";
import { ACCOUNTS_COPY as COPY } from "@/lib/data/ledger/copy";
import { ACCOUNT_STATE_FILTERS } from "@/lib/ledger/constants";
import type { AccountStateFilter } from "@/lib/types";

interface Props {
    state: AccountStateFilter | undefined;
    currency: string | undefined;
    currencies: readonly string[];
    panelId: string;
    disabled: boolean;
    onState: (state: AccountStateFilter | undefined) => void;
    onCurrency: (currency: string | undefined) => void;
}

const ALL = "all";

const STATE_TABS = [
    { id: ALL, label: COPY.all },
    ...(Object.keys(ACCOUNT_STATE_FILTERS) as AccountStateFilter[]).map(
        (id) => ({ id, label: COPY.states[id] }),
    ),
];

export default function AccountFilters({
    state,
    currency,
    currencies,
    panelId,
    disabled,
    onState,
    onCurrency,
}: Props) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {currencies.length > 1 ? (
                <Tabs
                    label={COPY.currencyLabel}
                    tabs={[
                        { id: ALL, label: COPY.all },
                        ...currencies.map((code) => ({
                            id: code,
                            label: code,
                        })),
                    ]}
                    value={currency ?? ALL}
                    onChange={(id) => onCurrency(id === ALL ? undefined : id)}
                    panelId={panelId}
                    disabled={disabled}
                />
            ) : null}
            <Tabs
                label={COPY.stateLabel}
                tabs={STATE_TABS}
                value={state ?? ALL}
                onChange={(id) =>
                    onState(id === ALL ? undefined : (id as AccountStateFilter))
                }
                panelId={panelId}
                disabled={disabled}
            />
        </div>
    );
}
