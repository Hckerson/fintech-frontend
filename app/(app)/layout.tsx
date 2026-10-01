import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { LOGIN_ROUTE } from "@/lib/constants";
import { getSession } from "@/lib/utils/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
    if (!(await getSession())) redirect(LOGIN_ROUTE);

    return children;
}
