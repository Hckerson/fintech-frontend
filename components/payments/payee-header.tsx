"use client";
import { Add } from "@carbon/icons-react";
import PageHeader from "@/components/shell/page-header";
import Button from "@/components/ui/button";
import { PAGE_TITLES } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";

interface Props {
    canAdd: boolean;
    online: boolean;
    onAdd: () => void;
}

export default function PayeeHeader({ canAdd, online, onAdd }: Props) {
    return (
        <PageHeader
            eyebrow={PAYEE_COPY.eyebrow}
            title={PAGE_TITLES.payments}
            actions={
                canAdd ? (
                    <Button
                        size="lg"
                        aria-disabled={!online}
                        onClick={() => online && onAdd()}
                    >
                        <Add aria-hidden className="size-4 shrink-0" />
                        {PAYEE_COPY.add}
                    </Button>
                ) : null
            }
        />
    );
}
