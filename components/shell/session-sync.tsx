"use client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LOGIN_ROUTE } from "@/lib/constants";
import { useSessionEvents } from "@/lib/hooks/use-session-events";

export default function SessionSync() {
    const router = useRouter();
    const queryClient = useQueryClient();

    useSessionEvents((event) => {
        queryClient.clear();
        if (event === "signed-out") router.replace(LOGIN_ROUTE);
        router.refresh();
    });

    return null;
}
