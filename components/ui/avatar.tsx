import clsx from "clsx";
import { initialsOf } from "@/lib/utils/navigation";

interface Props {
    name: string;
    className?: string;
}

export default function Avatar({ name, className }: Props) {
    return (
        <span
            aria-hidden
            className={clsx(
                "bg-accent-light text-accent text-caption flex size-7 shrink-0 items-center justify-center rounded-full font-semibold",
                className,
            )}
        >
            {initialsOf(name)}
        </span>
    );
}
