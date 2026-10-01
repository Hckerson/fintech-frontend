import { isAxiosError } from "axios";

export const statusOf = (error: unknown): number | undefined =>
    isAxiosError(error) ? error.response?.status : undefined;

export const bodyOf = (error: unknown): unknown =>
    isAxiosError(error) ? error.response?.data : undefined;

export const retryAfterOf = (error: unknown): number | undefined => {
    const seconds = isAxiosError(error)
        ? Number(error.response?.headers["retry-after"])
        : NaN;
    return seconds > 0 ? seconds : undefined;
};
