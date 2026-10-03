import SectionSkeleton from "@/components/common/section-skeleton";

export default function DashboardSkeleton() {
    return (
        <div
            aria-busy
            className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_var(--shell-rail)]"
        >
            <div className="flex flex-col gap-4">
                <SectionSkeleton bare rows={1} rowClassName="h-96" />
                <SectionSkeleton bare rows={6} />
            </div>
            <div className="flex flex-col gap-4">
                <SectionSkeleton bare rows={4} />
                <SectionSkeleton bare rows={5} rowClassName="h-12" />
            </div>
        </div>
    );
}
