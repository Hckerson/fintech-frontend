import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/utils/session";
import { ADMIN_ROLE, LOGIN_ROUTE } from "@/lib/constants";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) redirect(LOGIN_ROUTE);
    if (session.role !== ADMIN_ROLE) notFound();

    return children;
}
