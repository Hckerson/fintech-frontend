import type { z } from "zod";
import type {
    PeriodSeriesResponseDto,
    PeriodTotalResponseDto,
    UserResponseDto,
} from "@/lib/contract/schemas";
import type {
    adminUsersSearchParamsSchema,
    createUserFormSchema,
} from "@/lib/validations/admin-users";
import type { ChartPoint } from "./chart";
import type { Delta, ShellNavItem } from "./shell";

export type PlatformRole = "support" | "compliance" | "admin";

export type StatsPeriod = PeriodTotalResponseDto["period"];

export interface AdminNavItem extends ShellNavItem {
    roles: readonly PlatformRole[];
}

export interface AdminUserTotal extends PeriodTotalResponseDto {
    previousTotal: number;
    asOf: string;
}

export interface AdminUserSeries extends PeriodSeriesResponseDto {
    asOf: string;
}

export interface PlatformOrigin {
    firstUserAt: string;
}

export interface PeriodRow extends ChartPoint {
    share: number;
    scale: number;
    partial: boolean;
    delta: Delta | null;
}

export interface SeriesView {
    points: ChartPoint[];
    total: number;
    peak: ChartPoint | undefined;
    partial: string | undefined;
    omitted: number;
}

export type AdminUser = UserResponseDto;

export type AdminUserFilters = z.infer<typeof adminUsersSearchParamsSchema>;

export type CreateUserForm = z.infer<typeof createUserFormSchema>;

export type CreateUserField = keyof CreateUserForm;

export interface AdminUserList {
    items: AdminUser[];
    total: number;
    asOf: string;
}
