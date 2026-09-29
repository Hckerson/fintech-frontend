import HelpRow from "@/components/help/help-row";
import HelpCategoryIcon from "@/components/help/help-category-icon";
import type { HelpGroup } from "@/lib/types";

interface Props {
    groups: readonly HelpGroup[];
}

export default function HelpLedger({ groups }: Props) {
    return (
        <div className="flex flex-col gap-12">
            {groups.map(({ category, articles }) => (
                <section
                    key={category.id}
                    aria-labelledby={`help-${category.id}`}
                >
                    <h2
                        id={`help-${category.id}`}
                        className="text-text-muted flex items-center gap-3 font-mono text-xs tracking-[0.14em] uppercase"
                    >
                        <HelpCategoryIcon
                            icon={category.icon}
                            className="size-4"
                        />
                        {category.title}
                        <span
                            aria-hidden
                            className="bg-border-dark h-px flex-1"
                        />
                    </h2>
                    <ul className="mt-2">
                        {articles.map((article) => (
                            <HelpRow key={article.slug} article={article} />
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}
