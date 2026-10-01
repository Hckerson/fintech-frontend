import { NOT_AVAILABLE } from "@/lib/constants";

interface Props {
    text: string | null;
    value?: number;
    className?: string;
}

export default function NumberDisplay({ text, value, className }: Props) {
    return (
        <data value={value} className={className}>
            {text ?? <span aria-label={NOT_AVAILABLE}>—</span>}
        </data>
    );
}
