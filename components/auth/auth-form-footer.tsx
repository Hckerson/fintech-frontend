import Link from "next/link";

interface Props {
    prompt: string;
    label: string;
    href: string;
}

export default function AuthFormFooter({ prompt, label, href }: Props) {
    return (
        <p className="text-text-secondary text-sm">
            {prompt}{" "}
            <Link
                href={href}
                className="text-text font-medium underline-offset-4 hover:underline"
            >
                {label}
            </Link>
        </p>
    );
}
