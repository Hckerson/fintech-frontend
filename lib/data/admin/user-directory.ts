import type { AdminUser } from "@/lib/types";
import { adminUserListSchema } from "@/lib/validations/admin-users";

const ROWS = [
    "Amara Okafor|amara.okafor@northwind.example|USER|ACTIVE|2026-10-02T14:12",
    "Daniel Whitlock|daniel@whitlockstudio.example|USER|PENDING|2026-10-02T09:41",
    "Priya Raman|priya.raman@ledgerline.example|ADMIN|ACTIVE|2026-10-01T16:05",
    "Tomás Herrera|tomas@herrerafreight.example|USER|ACTIVE|2026-09-30T11:27",
    "Mei Tanaka|mei.tanaka@kitsunebakery.example|USER|ACTIVE|2026-09-29T08:50",
    "Oliver Brandt|oliver@brandtarchitects.example|USER|SUSPENDED|2026-09-27T17:33",
    "Fatima Al-Sayed|fatima@alsayedtrading.example|USER|ACTIVE|2026-09-26T10:02",
    "Callum Reid|callum.reid@ledgerline.example|ADMIN|ACTIVE|2026-09-24T13:18",
    "Ingrid Solberg|ingrid@solbergmarine.example|USER|ACTIVE|2026-09-22T07:44",
    "Kwame Mensah|kwame@goldcoastfoods.example|USER|PENDING|2026-09-19T15:09",
    "Hannah Fischer|hannah@fischerdental.example|USER|ACTIVE|2026-09-15T12:30",
    "Rafael Costa|rafael.costa@costaimports.example|USER|ACTIVE|2026-09-11T09:16",
    "Siobhan Byrne|siobhan@byrnelegal.example|USER|SUSPENDED|2026-09-04T18:21",
    "Arjun Mehta|arjun@mehtalogistics.example|USER|ACTIVE|2026-08-28T10:55",
    "Elena Petrova|elena@petrovadesign.example|USER|ACTIVE|2026-08-21T14:40",
    "Marcus Lindqvist|marcus.lindqvist@ledgerline.example|ADMIN|ACTIVE|2026-08-12T08:05",
    "Zainab Hussain|zainab@hussainpharmacy.example|USER|ACTIVE|2026-07-30T11:11",
    "Lucas Moreau|lucas.moreau@moreauvins.example|USER|PENDING|2026-07-18T16:47",
    "Grace Adeyemi|grace@adeyemiconsulting.example|USER|ACTIVE|2026-06-25T09:29",
    "Henrik Dahl|henrik.dahl@dahltimber.example|USER|ACTIVE|2026-06-03T13:52",
    "Yuki Nakamura|yuki@nakamuraoptics.example|USER|ACTIVE|2026-05-14T07:36",
    "Beatriz Santos|beatriz@santostextiles.example|USER|SUSPENDED|2026-04-22T15:58",
    "Noah Griffiths|noah@griffithsbrewing.example|USER|ACTIVE|2026-03-09T10:20",
    "Leila Haddad|leila.haddad@haddadclinics.example|USER|ACTIVE|2026-02-02T12:03",
] as const;

export const ADMIN_USER_SEED: readonly AdminUser[] = adminUserListSchema.parse(
    ROWS.map((row, index) => {
        const [fullName, email, role, status, minute] = row.split("|");
        const createdAt = `${minute}:00.000Z`;

        return {
            id: `usr_seed_${String(index + 1).padStart(3, "0")}`,
            fullName,
            email,
            phoneNumber: null,
            avatar: null,
            bio: null,
            role,
            status,
            createdAt,
            updatedAt: createdAt,
            lastActive: status === "ACTIVE" ? createdAt : null,
        };
    }),
);
