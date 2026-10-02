const ONES = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
];

const TENS = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
];

const SCALES = [
    "",
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
];

const GROUP = 1_000;

const belowHundred = (value: number) =>
    value < ONES.length
        ? ONES[value]
        : [TENS[Math.trunc(value / 10)], value % 10 ? ONES[value % 10] : ""]
              .filter(Boolean)
              .join("-");

const belowThousand = (value: number) => {
    const hundreds = Math.trunc(value / 100);
    const rest = value % 100;

    return [
        hundreds ? `${ONES[hundreds]} hundred` : "",
        rest ? belowHundred(rest) : "",
    ]
        .filter(Boolean)
        .join(" and ");
};

export const integerWords = (value: bigint): string => {
    if (value === BigInt(0)) return ONES[0];

    const groups: string[] = [];
    let rest = value;
    for (let scale = 0; rest > BigInt(0); scale++) {
        const group = Number(rest % BigInt(GROUP));
        if (group) {
            groups.unshift(
                [belowThousand(group), SCALES[scale]].filter(Boolean).join(" "),
            );
        }
        rest /= BigInt(GROUP);
    }
    return groups.join(", ");
};

export const amountWords = (amountMinor: string, digits: number): string => {
    const scale = BigInt(10) ** BigInt(digits);
    const minor = BigInt(amountMinor);
    const whole = integerWords(minor / scale);
    const words = whole.charAt(0).toUpperCase() + whole.slice(1);

    return digits
        ? `${words} and ${(minor % scale).toString().padStart(digits, "0")}/${scale}`
        : words;
};
