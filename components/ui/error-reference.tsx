import { ERROR_COPY } from "@/lib/data/error-messages";

export default function ErrorReference({ reference }: { reference: string }) {
    return (
        <p className="text-text-muted text-xs">
            {ERROR_COPY.reference}:{" "}
            <span className="font-mono select-all">{reference}</span>
        </p>
    );
}
