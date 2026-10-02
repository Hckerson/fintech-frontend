"use client";
import AsOf from "@/components/common/as-of";
import Button from "@/components/ui/button";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { useWorkspace } from "@/lib/hooks/use-workspace";

interface Props {
    shown: number;
    matched: number;
    asOf: string;
    hasMore: boolean;
    loadingMore: boolean;
    onLoadMore: () => void;
}

export default function PayeeFooter({
    shown,
    matched,
    asOf,
    hasMore,
    loadingMore,
    onLoadMore,
}: Props) {
    const { workspace } = useWorkspace();

    return (
        <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <p className="text-text-secondary text-xs tabular-nums">
                {PAYEE_COPY.showing(shown, matched)}
            </p>
            {hasMore ? (
                <Button
                    tone="quiet"
                    size="sm"
                    isLoading={loadingMore}
                    onClick={onLoadMore}
                >
                    {PAYEE_COPY.loadMore}
                </Button>
            ) : null}
            <AsOf asOf={asOf} timeZone={workspace.timeZone} />
        </div>
    );
}
