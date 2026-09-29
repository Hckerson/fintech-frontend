import clsx from "clsx";
import { HELP_CATEGORIES } from "@/lib/data/help/categories";
import { HELP_COPY } from "@/lib/data/help/copy";
import type { HelpCategoryId } from "@/lib/types";

interface Props {
    value: HelpCategoryId | null;
    onChange: (value: HelpCategoryId | null) => void;
}

const OPTIONS = [{ id: null, title: HELP_COPY.all }, ...HELP_CATEGORIES];

export default function HelpCategoryFilter({ value, onChange }: Props) {
    return (
        <div
            role="group"
            aria-label={HELP_COPY.categoriesLabel}
            className="flex flex-wrap gap-2"
        >
            {OPTIONS.map((option) => (
                <button
                    key={option.id ?? HELP_COPY.all}
                    type="button"
                    aria-pressed={value === option.id}
                    onClick={() => onChange(option.id)}
                    className={clsx(
                        "h-9 cursor-pointer rounded-full border px-4 text-sm transition-colors",
                        value === option.id
                            ? "border-text bg-text text-text-inverse"
                            : "border-border-dark text-text-secondary hover:border-text-secondary hover:text-text",
                    )}
                >
                    {option.title}
                </button>
            ))}
        </div>
    );
}
