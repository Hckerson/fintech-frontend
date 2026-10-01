import NotFoundPanel from "@/components/status/not-found-panel";
import { DASHBOARD_LINK } from "@/lib/data/shell";

export default function WorkspaceNotFound() {
    return (
        <div className="flex flex-1 flex-col py-6">
            <NotFoundPanel home={DASHBOARD_LINK} showPath={false} />
        </div>
    );
}
