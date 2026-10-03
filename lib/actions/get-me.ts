"use server";
import { readEnvelope } from "@/lib/api-server";
import { routes } from "@/lib/contract/routes";
import { userResponseDtoSchema } from "@/lib/contract/schemas";
import { MEMBER_SEED } from "@/lib/data/ledger/accounts";
import { serverEnv } from "@/lib/utils/server-env";
import { standIn } from "@/lib/utils/stand-in";

export const getMe = async () =>
    serverEnv.liveData
        ? readEnvelope(routes.usersGetMe(), userResponseDtoSchema)
        : standIn(userResponseDtoSchema, (_, session) => ({
              id: session.sub,
              fullName: MEMBER_SEED.fullName,
              email: session.email,
              phoneNumber: null,
              avatar: null,
              bio: null,
              role: session.role,
              status: "ACTIVE" as const,
              createdAt: MEMBER_SEED.createdAt,
              updatedAt: MEMBER_SEED.createdAt,
              lastActive: null,
          }));
