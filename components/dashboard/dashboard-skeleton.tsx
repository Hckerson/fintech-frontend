import SectionSkeleton from "@/components/common/section-skeleton";

export default function DashboardSkeleton() {
    return (
        <div aria-busy className="flex flex-col gap-4">
            <SectionSkeleton rows={1} rowClassName="h-20" />
            <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="flex min-w-0 flex-col gap-4">
                    <SectionSkeleton rows={1} rowClassName="h-80" />
                    <SectionSkeleton rows={6} />
                </div>
                <div className="flex min-w-0 flex-col gap-4">
                    <SectionSkeleton rows={4} />
                    <SectionSkeleton rows={4} />
                </div>
            </div>
        </div>
    );
}
