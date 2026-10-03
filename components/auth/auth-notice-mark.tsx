import type { ComponentType } from "react";
import {
    CheckmarkFilled,
    Email,
    Locked,
    Time,
    type CarbonIconProps,
} from "@carbon/icons-react";
import type { NoticeTone } from "@/lib/types";

interface Props {
    tone: NoticeTone;
}

const marks: Record<
    NoticeTone,
    { icon: ComponentType<CarbonIconProps>; className: string }
> = {
    success: {
        icon: CheckmarkFilled,
        className: "border-success/30 bg-success-light text-success",
    },
    info: { icon: Email, className: "border-info/30 bg-info-light text-info" },
    warning: {
        icon: Time,
        className: "border-warning/30 bg-warning-light text-warning",
    },
    error: {
        icon: Locked,
        className: "border-error/30 bg-error-light text-error",
    },
};

export default function AuthNoticeMark({ tone }: Props) {
    const { icon: Icon, className } = marks[tone];

    return (
        <span
            aria-hidden
            className={`flex size-12 items-center justify-center rounded-xl border ${className}`}
        >
            <Icon className="size-5" />
        </span>
    );
}
