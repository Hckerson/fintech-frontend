import { DEFAULT_LOCALE } from "@/lib/constants";

const ZERO = BigInt(0);

export const fractionDigits = (currency: string, locale = DEFAULT_LOCALE) =>
    new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).resolvedOptions().maximumFractionDigits ?? 2;

export const toMajor = (minor: bigint, digits: number): `${number}` => {
    const scale = BigInt(10) ** BigInt(digits);
    const abs = minor < ZERO ? -minor : minor;
    const fraction = (abs % scale).toString().padStart(digits, "0");
    return `${minor < ZERO ? "-" : ""}${abs / scale}${digits ? `.${fraction}` : ""}` as `${number}`;
};

export const toMinor = (major: string, digits: number): bigint | null => {
    const match = /^(\d+)(?:\.(\d*))?$/.exec(major.replace(/[,\s]/g, ""));
    if (!match) return null;
    const fraction = (match[2] ?? "").slice(0, digits).padEnd(digits, "0");
    return BigInt(match[1] + fraction);
};

export const formatMoney = (
    amountMinor: string,
    currency: string,
    {
        locale = DEFAULT_LOCALE,
        signDisplay = "auto",
        maximumFractionDigits,
    }: {
        locale?: string;
        signDisplay?: Intl.NumberFormatOptions["signDisplay"];
        maximumFractionDigits?: number;
    } = {},
): string | null => {
    if (!/^-?\d+$/.test(amountMinor)) return null;
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        signDisplay,
        maximumFractionDigits,
    }).format(toMajor(BigInt(amountMinor), fractionDigits(currency, locale)));
};
