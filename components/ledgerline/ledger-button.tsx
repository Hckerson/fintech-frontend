import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

type Tone = "solid" | "accent" | "ghost";
type Size = "sm" | "lg";

interface Props {
    href: string;
    tone?: Tone;
    size?: Size;
    className?: string;
    onClick?: () => void;
    children: ReactNode;
}

const tones: Record<Tone, string> = {
    solid: "bg-text text-text-inverse hover:bg-accent",
    accent: "bg-accent text-text-inverse hover:bg-text",
    ghost: "border border-border-dark text-text hover:border-text-secondary hover:bg-background-muted",
};

const sizes: Record<Size, string> = {
    sm: "h-9 px-4 text-sm",
    lg: "h-12 px-6 text-base",
};

export const ledgerButtonClass = (
    tone: Tone = "solid",
    size: Size = "lg",
    className?: string,
) =>
    clsx(
        "group sheen inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        tones[tone],
        sizes[size],
        className,
    );

export default function LedgerButton({
    href,
    tone,
    size,
    className,
    onClick,
    children,
}: Props) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={ledgerButtonClass(tone, size, className)}
        >
            {children}
        </Link>
    );
}
