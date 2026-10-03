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

export const moneyParts = (
    amountMinor: string,
    currency: string,
    locale = DEFAULT_LOCALE,
) => {
    if (!/^-?\d+$/.test(amountMinor)) return null;
    const parts = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).formatToParts(
        toMajor(BigInt(amountMinor), fractionDigits(currency, locale)),
    );
    const decimal = parts.findIndex(({ type }) => type === "decimal");
    const text = (slice: Intl.NumberFormatPart[]) =>
        slice.map(({ value }) => value).join("");

    return decimal < 0
        ? { major: text(parts), minor: "" }
        : {
              major: text(parts.slice(0, decimal)),
              minor: text(parts.slice(decimal)),
          };
};
