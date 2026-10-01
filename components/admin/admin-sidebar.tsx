"use client";
import { usePathname } from "next/navigation";
import {
    Dashboard,
    Headset,
    Policy,
    UserMultiple,
    type CarbonIconType,
} from "@carbon/icons-react";
import ShellBrand from "@/components/shell/shell-brand";
import SidebarNav from "@/components/shell/sidebar-nav";
import { ADMIN_ROUTE } from "@/lib/constants";
import { ADMIN_AREA } from "@/lib/data/admin-nav";
import type { NavIcon, PlatformRole } from "@/lib/types";
import { currentNavId } from "@/lib/utils/navigation";
import { adminNavFor } from "@/lib/utils/platform-role";

const ICONS: Record<NavIcon, CarbonIconType> = {
    overview: Dashboard,
    users: UserMultiple,
    compliance: Policy,
    support: Headset,
};

export default function AdminSidebar({ role }: { role: PlatformRole }) {
    const pathname = usePathname();
    const items = adminNavFor(role);

    return (
        <SidebarNav
            label={ADMIN_AREA.name}
            currentId={currentNavId(pathname, items)}
            header={<ShellBrand name={ADMIN_AREA.name} href={ADMIN_ROUTE} />}
            sections={[
                {
                    id: "internal",
                    label: ADMIN_AREA.navLabel,
                    showLabel: true,
                    items: items.map(({ id, label, href, icon }) => {
                        const Icon = ICONS[icon];
                        return {
                            id,
                            label,
                            href,
                            icon: <Icon className="size-4" />,
                        };
                    }),
                },
            ]}
        />
    );
}
