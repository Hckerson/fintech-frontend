import type { ReactNode } from "react";
import CommandTrigger from "@/components/shell/command-trigger";
import UserMenu from "@/components/shell/user-menu";
import type { PaletteCommand } from "@/lib/types";

interface Props {
    commands: readonly PaletteCommand[];
    email: string;
    searchAllHref?: string;
    onPaletteOpenChange?: (open: boolean) => void;
    notifications?: ReactNode;
}

export default function UtilityBar({
    commands,
    email,
    searchAllHref,
    onPaletteOpenChange,
    notifications,
}: Props) {
    return (
        <>
            <CommandTrigger
                commands={commands}
                searchAllHref={searchAllHref}
                onOpenChange={onPaletteOpenChange}
            />
            <div className="ml-auto flex items-center gap-2">
                {notifications}
                <UserMenu email={email} />
            </div>
        </>
    );
}
