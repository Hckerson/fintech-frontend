import { TRANSFER_AMOUNT_MAX_DIGITS } from "@/lib/payments/transfer-constants";

const AMOUNT = new RegExp(
    `^(\\d{1,${TRANSFER_AMOUNT_MAX_DIGITS}})(?:\\.(\\d+))?$`,
);

export const parseAmount = (text: string, digits: number): bigint | null => {
    const match = AMOUNT.exec(text.trim().replace(/,/g, ""));
    if (!match) return null;

    const fraction = match[2] ?? "";
    if (fraction.length > digits) return null;

    const minor = BigInt(match[1] + fraction.padEnd(digits, "0"));
    return minor > BigInt(0) ? minor : null;
};
