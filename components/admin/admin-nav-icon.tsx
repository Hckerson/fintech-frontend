import {
    Dashboard,
    Headset,
    Policy,
    UserMultiple,
    type CarbonIconType,
} from "@carbon/icons-react";
import type { NavIcon } from "@/lib/types";

interface Props {
    icon: NavIcon;
    className?: string;
}

const ICONS: Record<NavIcon, CarbonIconType> = {
    overview: Dashboard,
    users: UserMultiple,
    compliance: Policy,
    support: Headset,
};

export default function AdminNavIcon({ icon, className = "size-4" }: Props) {
    const Icon = ICONS[icon];

    return <Icon aria-hidden className={className} />;
}
