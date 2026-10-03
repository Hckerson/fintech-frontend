import type { PayeePayment } from "@/lib/types";

const settled = (
    id: string,
    paidAt: string,
    amountMinor: string,
    reference: string,
    currency = "GBP",
): PayeePayment => ({
    id,
    paidAt,
    amountMinor,
    currency,
    reference,
    status: "settled",
});

export const SEED_PAYEE_PAYMENTS: Record<string, readonly PayeePayment[]> = {
    pye_brightwater: [
        settled("pay_bw_3", "2026-09-24T10:12:00.000Z", "428180", "Q3 water"),
        settled("pay_bw_2", "2026-06-25T09:40:00.000Z", "431020", "Q2 water"),
        settled("pay_bw_1", "2026-03-26T11:05:00.000Z", "425350", "Q1 water"),
    ],
    pye_calder: [
        settled("pay_cf_2", "2026-08-29T15:40:00.000Z", "480000", "INV-2291"),
        settled("pay_cf_1", "2026-05-30T14:10:00.000Z", "480000", "INV-2140"),
    ],
    pye_halden: [
        settled(
            "pay_hf_3",
            "2026-09-12T08:05:00.000Z",
            "1845000",
            "Freight SEP",
            "EUR",
        ),
        settled(
            "pay_hf_2",
            "2026-08-14T08:20:00.000Z",
            "2370000",
            "Freight AUG",
            "EUR",
        ),
        settled(
            "pay_hf_1",
            "2026-07-02T13:45:00.000Z",
            "318000",
            "Customs fee",
        ),
    ],
    pye_northgate: [
        {
            id: "pay_ng_4",
            paidAt: "2026-09-30T07:30:00.000Z",
            amountMinor: "1350000",
            currency: "GBP",
            reference: "Rent OCT",
            status: "pending",
        },
        settled("pay_ng_3", "2026-08-31T07:30:00.000Z", "1350000", "Rent SEP"),
        settled("pay_ng_2", "2026-07-31T07:30:00.000Z", "1350000", "Rent AUG"),
        settled("pay_ng_1", "2026-06-30T07:30:00.000Z", "1350000", "Rent JUL"),
    ],
    pye_tern: [
        settled(
            "pay_tp_3",
            "2026-09-26T16:00:00.000Z",
            "6250025",
            "Payroll SEP",
        ),
        settled(
            "pay_tp_2",
            "2026-08-27T16:00:00.000Z",
            "6250000",
            "Payroll AUG",
        ),
        settled(
            "pay_tp_1",
            "2026-07-28T16:00:00.000Z",
            "6250000",
            "Payroll JUL",
        ),
    ],
};
