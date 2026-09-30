import { isAxiosError } from "axios";

export const statusOf = (error: unknown): number | undefined =>
    isAxiosError(error) ? error.response?.status : undefined;
