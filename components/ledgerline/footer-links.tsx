import Link from "next/link";
import { FOOTER_COLUMNS } from "@/lib/data/ledgerline/footer";

export default function FooterLinks() {
    return (
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
                <nav
                    key={column.id}
                    aria-label={column.title}
                    className="flex flex-col gap-4"
                >
                    <p className="text-text-muted font-mono text-xs tracking-[0.18em] uppercase">
                        {column.title}
                    </p>
                    {column.links.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            className="text-text-secondary hover:text-text text-sm transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            ))}
        </div>
    );
}
