"use client";
import Tabs from "@/components/ui/tabs";
import { DASHBOARD_VIEWS } from "@/lib/dashboard/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashFlowRange, DashboardView } from "@/lib/types";
import { cashFlowRangeSchema } from "@/lib/validations/dashboard";

interface Props {
    range: CashFlowRange;
    view: DashboardView;
    panelId: string;
    disabled: boolean;
    onRange: (range: CashFlowRange) => void;
    onView: (view: DashboardView) => void;
}

const COPY = DASHBOARD_COPY.overview;
const FLOW = DASHBOARD_COPY.cashFlow;
const RANGES = cashFlowRangeSchema.options;

export default function CashControls({
    range,
    view,
    panelId,
    disabled,
    onRange,
    onView,
}: Props) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Tabs
                label={COPY.viewLabel}
                tabs={DASHBOARD_VIEWS.map((id) => ({
                    id,
                    label: COPY.views[id],
                }))}
                value={view}
                onChange={onView}
                panelId={panelId}
                disabled={disabled}
            />
            <Tabs
                label={FLOW.rangeLabel}
                tabs={RANGES.map((id) => ({ id, label: FLOW.ranges[id] }))}
                value={range}
                onChange={onRange}
                panelId={panelId}
                disabled={disabled}
            />
        </div>
    );
}
