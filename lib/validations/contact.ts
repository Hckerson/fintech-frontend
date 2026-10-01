import { z } from "zod";
import { CTA_COPY } from "@/lib/data/ledgerline/closing";

export const contactSchema = z.object({
    email: z.email(CTA_COPY.invalid),
});

export type Contact = z.infer<typeof contactSchema>;
