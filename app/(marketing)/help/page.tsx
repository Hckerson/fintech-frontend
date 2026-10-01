import { Suspense } from "react";
import type { Metadata } from "next";
import HelpHeader from "@/components/help/help-header";
import HelpSearch from "@/components/help/help-search";
import HelpLedger from "@/components/help/help-ledger";
import HelpSupport from "@/components/help/help-support";
import { HELP_ARTICLES } from "@/lib/data/help/articles";
import { HELP_COPY } from "@/lib/data/help/copy";
import { groupByCategory } from "@/lib/help/articles";

export const metadata: Metadata = {
    title: HELP_COPY.metaTitle,
    description: HELP_COPY.metaDescription,
};

export default function HelpPage() {
    return (
        <div className="pt-(--ledger-header)">
            <div className="ledger-shell ledger-section flex flex-col gap-14">
                <HelpHeader />
                <Suspense
                    fallback={
                        <HelpLedger groups={groupByCategory(HELP_ARTICLES)} />
                    }
                >
                    <HelpSearch />
                </Suspense>
                <HelpSupport />
            </div>
        </div>
    );
}
