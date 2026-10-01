import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { formatMoney, toMajor, toMinor } from "./money";

describe("money", () => {
    it("round-trips minor units through a major-unit string exactly", () => {
        fc.assert(
            fc.property(
                fc.bigInt({ min: BigInt(0), max: BigInt(10) ** BigInt(20) }),
                (minor) => toMinor(toMajor(minor, 2), 2) === minor,
            ),
        );
    });

    it("reads what people type, and refuses what is not an amount", () => {
        expect(toMinor("1,250.5", 2)).toBe(BigInt(125_050));
        expect(toMinor("12.999", 2)).toBe(BigInt(1_299));
        expect(toMinor("-3", 2)).toBeNull();
        expect(toMinor("abc", 2)).toBeNull();
    });

    it("formats without losing precision past the safe integer range", () => {
        expect(formatMoney("900719925474099312", "GBP")).toBe(
            "£9,007,199,254,740,993.12",
        );
    });

    it("shows nothing for a value that is not an integer string", () => {
        expect(formatMoney("12.5", "GBP")).toBeNull();
    });
});
