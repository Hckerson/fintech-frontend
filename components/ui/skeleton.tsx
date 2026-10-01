import clsx from "clsx";

interface Props {
    className?: string;
}

export default function Skeleton({ className }: Props) {
    return (
        <span
            aria-hidden
            className={clsx(
                "bg-background-muted block animate-pulse rounded-md",
                className,
            )}
        />
    );
}
