"use client";
import Link from "next/link";
import { ChevronDown } from "@carbon/icons-react";
import Avatar from "@/components/ui/avatar";
import Menu from "@/components/ui/menu";
import { HELP_ROUTE, PROFILE_ROUTE } from "@/lib/constants";
import { SHELL_COPY } from "@/lib/data/shell";
import { useLogout } from "@/lib/hooks/use-logout";
import { useMe } from "@/lib/hooks/use-me";
import { announceSession } from "@/lib/utils/session-events";

interface Props {
    email: string;
}

const COPY = SHELL_COPY.account;

export default function UserMenu({ email }: Props) {
    const name = useMe().data?.fullName ?? email;
    const logout = useLogout();
    const leaving = logout.isPending || logout.isSuccess;

    const signOut = () => {
        if (leaving) return;
        logout.mutate(undefined, {
            onSuccess: () => announceSession("signed-out"),
        });
    };

    return (
        <Menu
            label={COPY.menu(name)}
            align="end"
            triggerClassName="border-border hover:border-border-dark flex h-9 items-center gap-2 rounded-lg border pr-2 pl-1 transition-colors"
            trigger={
                <>
                    <Avatar name={name} className="rounded-md" />
                    <span className="text-text text-compact hidden max-w-36 truncate font-medium sm:block">
                        {name}
                    </span>
                    <ChevronDown
                        aria-hidden
                        className="text-text-muted size-4 shrink-0"
                    />
                </>
            }
        >
            {(close) => (
                <>
                    <p className="border-border text-text-muted truncate border-b px-2.5 py-2 text-xs">
                        {email}
                    </p>
                    <Link href={PROFILE_ROUTE} role="menuitem" onClick={close}>
                        {COPY.profile}
                    </Link>
                    <Link href={HELP_ROUTE} role="menuitem" onClick={close}>
                        {COPY.help}
                    </Link>
                    <button
                        type="button"
                        role="menuitem"
                        aria-busy={leaving}
                        onClick={signOut}
                    >
                        {leaving ? COPY.signingOut : COPY.signOut}
                    </button>
                    {logout.isError ? (
                        <p
                            role="alert"
                            className="text-error px-2.5 py-2 text-xs"
                        >
                            {COPY.signOutFailed}
                        </p>
                    ) : null}
                </>
            )}
        </Menu>
    );
}
