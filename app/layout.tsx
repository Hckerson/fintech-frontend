import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import Provider from "@/components/providers/provider";
import { ledgerBody, mono } from "@/public/fonts/font";
import {
    LEDGERLINE_THEME_CLASS,
    LEDGERLINE_THEME_COLOR,
} from "@/lib/ledgerline/constants";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    colorScheme: "dark",
    themeColor: LEDGERLINE_THEME_COLOR,
};

export const metadata: Metadata = {
    title: "Ledgerline · Placeholder business bank",
    description:
        "A design study: business accounts, transfers and statements on a ledger that balances in real time.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${LEDGERLINE_THEME_CLASS} ${ledgerBody.variable} ${mono.variable} scroll-pt-(--ledger-header) scroll-smooth motion-reduce:scroll-auto`}
        >
            <body className="bg-background text-text font-body antialiased">
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
