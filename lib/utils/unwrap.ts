import { REQUEST_FAILED } from "@/lib/constants";
import type { ActionResult, ErrorKind } from "@/lib/types/api";
import { ActionError } from "@/lib/utils/action-error";

export const unwrap = <TData>(result: ActionResult<TData>): TData => {
    if (!result.ok) throw ActionError.from(result);
    return result.data;
};

export const settle = async <TData>(
    work: Promise<ActionResult<TData>>,
    deadline: number,
    lost: ErrorKind,
): Promise<TData> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const late = new Promise<never>((_, reject) => {
        timer = setTimeout(
            () => reject(new ActionError(lost, REQUEST_FAILED)),
            deadline,
        );
    });

    try {
        return unwrap(await Promise.race([work, late]));
    } catch (error) {
        throw error instanceof ActionError
            ? error
            : new ActionError(lost, REQUEST_FAILED);
    } finally {
        clearTimeout(timer);
    }
};
