import EmptyState from "@/components/ui/empty-state";
import { DASHBOARD_LINK, SHELL_COPY } from "@/lib/data/shell";

interface Props {
    page: string;
    offerDashboard?: boolean;
}

export default function NotPermitted({ page, offerDashboard = true }: Props) {
    return (
        <div className="surface-card p-4">
            <EmptyState
                {...SHELL_COPY.notPermitted(page)}
                action={offerDashboard ? DASHBOARD_LINK : undefined}
            />
        </div>
    );
}
