import { useSyncExternalStore } from "react";
import { useMutation } from "@tanstack/react-query";
import { local } from "@/lib/api-client";
import { apiRoutes } from "@/lib/api-routes";
import { passkeyOptionsSchema } from "@/lib/validations/auth";

const subscribe = () => () => {};

export const usePasskeySupport = () =>
    useSyncExternalStore(
        subscribe,
        () =>
            "PublicKeyCredential" in window &&
            "parseRequestOptionsFromJSON" in PublicKeyCredential,
        () => false,
    );

export const usePasskeyAssertion = () =>
    useMutation({
        mutationFn: async (challenge: string) => {
            const options = passkeyOptionsSchema.parse(
                await local.post<unknown>(apiRoutes.challengePasskey(), {
                    challenge,
                }),
            );
            const credential = await navigator.credentials.get({
                publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(
                    options.data as unknown as PublicKeyCredentialRequestOptionsJSON,
                ),
            });
            return (credential as PublicKeyCredential).toJSON() as Record<
                string,
                unknown
            >;
        },
    });
