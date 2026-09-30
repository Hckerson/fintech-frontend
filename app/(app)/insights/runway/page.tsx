import { Suspense } from "react";
import type { Metadata } from "next";
import PageHeader from "@/components/shell/page-header";
import RunwayCalculator from "@/components/insights/runway-calculator";
import { RUNWAY_COPY } from "@/lib/data/insights/runway";

export const metadata: Metadata = { title: RUNWAY_COPY.metaTitle };

export default function RunwayPage() {
    return (
        <main className="ledger-shell flex flex-col gap-4 py-6">
            <PageHeader
                eyebrow={RUNWAY_COPY.eyebrow}
                title={RUNWAY_COPY.title}
                lead={RUNWAY_COPY.lead}
            />
            <Suspense>
                <RunwayCalculator />
            </Suspense>
        </main>
    );
}
