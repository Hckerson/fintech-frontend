import SectionSkeleton from "@/components/common/section-skeleton";

export default function WorkspaceLoading() {
    return (
        <div aria-busy className="flex flex-col gap-4">
            <SectionSkeleton rows={1} rowClassName="h-12" />
            <SectionSkeleton rows={6} />
        </div>
    );
}
