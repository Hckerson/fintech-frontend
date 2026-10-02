import { useMutation } from "@tanstack/react-query";
import { getTransferStatus } from "@/lib/actions/get-transfer-status";
import { REQUEST_TIMEOUT_MS } from "@/lib/constants";
import type { Transfer } from "@/lib/types";
import type { ActionError } from "@/lib/utils/action-error";
import { settle } from "@/lib/utils/unwrap";

export const useTransferStatus = () =>
    useMutation<Transfer | null, ActionError, string>({
        networkMode: "always",
        retry: false,
        mutationFn: (idempotencyKey) =>
            settle(
                getTransferStatus(idempotencyKey),
                REQUEST_TIMEOUT_MS,
                "unavailable",
            ),
    });
