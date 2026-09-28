import FrameTopbar from "@/components/ledgerline/frame-topbar";
import FrameSidebar from "@/components/ledgerline/frame-sidebar";
import FrameCash from "@/components/ledgerline/frame-cash";
import FrameActivity from "@/components/ledgerline/frame-activity";
import FrameAccounts from "@/components/ledgerline/frame-accounts";
import FrameApprovals from "@/components/ledgerline/frame-approvals";
import { DASHBOARD } from "@/lib/data/ledgerline/dashboard";

export default function ProductFrame() {
    return (
        <div role="img" aria-label={DASHBOARD.previewLabel} className="overflow-hidden rounded-xl bg-background-alt">
            <FrameTopbar />
            <div className="flex">
                <FrameSidebar />
                <div className="grid flex-1 gap-4 p-4 md:grid-cols-5 lg:p-5">
                    <div className="flex flex-col gap-4 md:col-span-3">
                        <FrameCash />
                        <FrameActivity />
                    </div>
                    <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
                        <FrameAccounts />
                        <FrameApprovals />
                    </div>
                </div>
            </div>
        </div>
    );
}
