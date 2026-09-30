"use client";
import type { ErrorBoundaryProps } from "@/lib/types";
import "@/styles/globals.css";
import ServerErrorPanel from "@/components/status/server-error-panel";
import { ledgerBody, mono } from "@/public/fonts/font";
import { LEDGERLINE_THEME_CLASS } from "@/lib/ledgerline/constants";

export default function GlobalError(props: ErrorBoundaryProps) {
    return (
        <html
            lang="en"
            className={`${LEDGERLINE_THEME_CLASS} ${ledgerBody.variable} ${mono.variable}`}
        >
            <body className="bg-background text-text font-body antialiased">
                <main className="status-page">
                    <ServerErrorPanel {...props} />
                </main>
            </body>
        </html>
    );
}
