import { FRACTION_DIGITS, LEDGERLINE_LOCALE, MINOR_UNITS } from "@/lib/ledgerline/constants";

const FRACTION = { minimumFractionDigits: FRACTION_DIGITS, maximumFractionDigits: FRACTION_DIGITS } as const;
const DECIMAL = new RegExp(`^-?\\d+\\.\\d{${FRACTION_DIGITS}}$`);
const formatters = new Map<string, Intl.NumberFormat>();

const isDecimal = (value: string): value is `${number}` => DECIMAL.test(value);

const toDecimal = (minor: number): `${number}` => {
    if (!Number.isSafeInteger(minor)) throw new RangeError(`Amount must be a whole number of minor units: ${minor}`);
    const abs = Math.abs(minor);
    const fraction = abs % MINOR_UNITS;
    const whole = (abs - fraction) / MINOR_UNITS;
    const decimal = `${minor < 0 ? "-" : ""}${whole}.${String(fraction).padStart(FRACTION_DIGITS, "0")}`;
    if (!isDecimal(decimal)) throw new RangeError(`Could not express ${minor} as a decimal`);
    return decimal;
};

const formatter = (currency: string | null): Intl.NumberFormat => {
    const key = currency ?? "plain";
    const cached = formatters.get(key);
    if (cached) return cached;
    const created = currency
        ? new Intl.NumberFormat(LEDGERLINE_LOCALE, { style: "currency", currency, ...FRACTION })
        : new Intl.NumberFormat(LEDGERLINE_LOCALE, FRACTION);
    formatters.set(key, created);
    return created;
};

export const formatMoney = (minor: number, currency: string): string => formatter(currency).format(toDecimal(minor));

export const formatAmount = (minor: number): string => formatter(null).format(toDecimal(minor));

export const SIGN = { in: "+", out: "−" } as const;

export const signOf = (minor: number): keyof typeof SIGN => (minor < 0 ? "out" : "in");

export const formatSigned = (minor: number): string => `${SIGN[signOf(minor)]}${formatAmount(Math.abs(minor))}`;
