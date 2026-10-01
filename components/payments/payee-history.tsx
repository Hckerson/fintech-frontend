import Amount from "@/components/common/amount";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";
import { formatInstant } from "@/lib/utils/date-formatter";

export default function PayeeHistory({ payee }: { payee: Payee }) {
    return (
        <dl className="text-text-secondary flex flex-col gap-1 text-xs">
            <div className="flex flex-wrap gap-x-2">
                <dt>{PAYEE_COPY.lastPaid}</dt>
                <dd className="text-text">
                    {payee.lastPaidAt ? (
                        <time dateTime={payee.lastPaidAt}>
                            {formatInstant(payee.lastPaidAt)}
                        </time>
                    ) : (
                        PAYEE_COPY.neverPaid
                    )}
                </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
                <dt>{PAYEE_COPY.totalPaid}</dt>
                <dd className="text-text flex flex-col font-mono tabular-nums">
                    {payee.totalPaid.length === 0
                        ? PAYEE_COPY.nothingPaid
                        : payee.totalPaid.map(({ currency, amountMinor }) => (
                              <span key={currency}>
                                  <Amount
                                      amountMinor={amountMinor}
                                      currency={currency}
                                  />{" "}
                                  {currency}
                              </span>
                          ))}
                </dd>
            </div>
        </dl>
    );
}
