import SectionSkeleton from "@/components/common/section-skeleton";

export default function DashboardSkeleton() {
    return (
        <div
            aria-busy
            className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
        >
            <div className="flex min-w-0 flex-col gap-4">
                <SectionSkeleton rows={1} rowClassName="h-28" />
                <SectionSkeleton rows={1} rowClassName="h-80" />
            </div>
            <div className="flex min-w-0 flex-col gap-4">
                <SectionSkeleton rows={4} />
                <SectionSkeleton rows={4} />
            </div>
        </div>
    );
}
