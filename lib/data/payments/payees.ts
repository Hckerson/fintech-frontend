import type { StoredPayee } from "@/lib/types";

const SEEDED_AT = "2026-09-01T09:00:00.000Z";

const ACTIVE = {
    status: "active",
    paymentInProgress: false,
    updatedAt: SEEDED_AT,
} as const;

export const SEED_PAYEES: StoredPayee[] = [
    {
        ...ACTIVE,
        id: "pye_brightwater",
        name: "Brightwater Utilities",
        destination: "20415531926074",
        destinationLast4: "6074",
        bankName: "Barclays",
        lastPaidAt: "2026-09-24T10:12:00.000Z",
        totalPaid: [{ currency: "GBP", amountMinor: "1284550" }],
    },
    {
        ...ACTIVE,
        id: "pye_calder",
        name: "Calder & Finch Accountants",
        destination: "40112273518846",
        destinationLast4: "8846",
        bankName: "HSBC UK",
        lastPaidAt: "2026-08-29T15:40:00.000Z",
        totalPaid: [{ currency: "GBP", amountMinor: "960000" }],
    },
    {
        ...ACTIVE,
        id: "pye_halden",
        name: "Halden Freight GmbH",
        destination: "60837190024417",
        destinationLast4: "4417",
        bankName: null,
        lastPaidAt: "2026-09-12T08:05:00.000Z",
        totalPaid: [
            { currency: "EUR", amountMinor: "4215000" },
            { currency: "GBP", amountMinor: "318000" },
        ],
    },
    {
        ...ACTIVE,
        id: "pye_northgate",
        name: "Northgate Property Lettings",
        destination: "30906512845590",
        destinationLast4: "5590",
        bankName: "Lloyds Bank",
        lastPaidAt: "2026-09-30T07:30:00.000Z",
        totalPaid: [{ currency: "GBP", amountMinor: "5400000" }],
        paymentInProgress: true,
    },
    {
        ...ACTIVE,
        id: "pye_orchard",
        name: "Orchard Office Supplies",
        destination: "08719963320158",
        destinationLast4: "0158",
        bankName: "Co-operative Bank",
        lastPaidAt: null,
        totalPaid: [],
    },
    {
        ...ACTIVE,
        id: "pye_sable",
        name: "Sable Studio Ltd",
        destination: "04000477120963",
        destinationLast4: "0963",
        bankName: "Monzo",
        lastPaidAt: null,
        totalPaid: [],
        status: "pending_verification",
    },
    {
        ...ACTIVE,
        id: "pye_tern",
        name: "Tern Payroll Services",
        destination: "23146980557231",
        destinationLast4: "7231",
        bankName: "NatWest",
        lastPaidAt: "2026-09-26T16:00:00.000Z",
        totalPaid: [{ currency: "GBP", amountMinor: "18750025" }],
    },
];
