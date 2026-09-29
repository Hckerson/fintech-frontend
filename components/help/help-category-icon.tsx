import {
    DataTable,
    Document,
    Locked,
    Rocket,
    UserMultiple,
    Wallet,
    type CarbonIconType,
} from "@carbon/icons-react";
import type { HelpCategoryIcon as IconName } from "@/lib/types";

const ICONS: Record<IconName, CarbonIconType> = {
    start: Rocket,
    wallet: Wallet,
    table: DataTable,
    document: Document,
    team: UserMultiple,
    lock: Locked,
};

interface Props {
    icon: IconName;
    className?: string;
}

export default function HelpCategoryIcon({ icon, className }: Props) {
    const Icon = ICONS[icon];
    return <Icon aria-hidden className={className} />;
}
