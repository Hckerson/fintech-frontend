import type {
    PeriodSeriesResponseDto,
    PeriodTotalResponseDto,
} from "@/lib/contract/schemas";
import type { ChartPoint } from "./chart";
import type { ShellNavItem } from "./shell";

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

export interface SeriesView {
    points: ChartPoint[];
    total: number;
    peak: ChartPoint | undefined;
    partial: string | undefined;
    omitted: number;
}
