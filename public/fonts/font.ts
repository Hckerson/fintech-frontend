import {
    Fraunces,
    Libre_Franklin,
    JetBrains_Mono,
    Inter_Tight,
    Geist,
    Geist_Mono,
} from "next/font/google";

const display = Fraunces({
    subsets: ["latin"],
    style: ["normal", "italic"],
    variable: "--nf-display",
    display: "swap",
    fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = Libre_Franklin({
    subsets: ["latin"],
    variable: "--nf-body",
    display: "swap",
    fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

const mono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--nf-mono",
    display: "swap",
    fallback: ["ui-monospace", "monospace"],
});

const ledgerBody = Inter_Tight({
    subsets: ["latin"],
    variable: "--nf-ledger-body",
    display: "swap",
    fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

const appSans = Geist({
    subsets: ["latin"],
    variable: "--nf-app",
    display: "swap",
    fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

const appMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--nf-app-mono",
    display: "swap",
    fallback: ["ui-monospace", "monospace"],
});

export { display, sans, mono, ledgerBody, appSans, appMono };
