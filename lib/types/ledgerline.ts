import type { MotionValue } from "motion/react";

export interface DampedPointer {
    x: MotionValue<number>;
    y: MotionValue<number>;
    presence: MotionValue<number>;
}

export interface ChartBox {
    width: number;
    height: number;
    pad: number;
    padX?: number;
}

export interface NavLink {
    id: string;
    label: string;
    href: string;
}

export interface Figure {
    id: string;
    value: string;
    label: string;
}

export interface CurrencyAccount {
    id: string;
    code: string;
    name: string;
    balanceMinor: number;
}

export interface ActivityEntry {
    id: string;
    name: string;
    category: string;
    date: string;
    amountMinor: number;
}

export interface Approval {
    id: string;
    payee: string;
    reference: string;
    amountMinor: number;
    currency: string;
    requester: string;
}

export interface ApprovalStep {
    id: string;
    label: string;
    actor: string;
    initials: string;
}

export interface FeaturePoint {
    id: string;
    title: string;
    detail: string;
}

export interface CardControl {
    id: string;
    label: string;
    detail: string;
    enabled: boolean;
}

export interface MatchedEntry {
    id: string;
    description: string;
    account: string;
    amountMinor: number;
}

export type SecurityIcon =
    "approvals" | "roles" | "audit" | "keys" | "funds" | "monitoring";

export interface SecurityControl {
    id: string;
    icon: SecurityIcon;
    title: string;
    detail: string;
}

export interface Plan {
    id: string;
    name: string;
    price: string;
    cadence: string;
    summary: string;
    features: readonly string[];
    featured: boolean;
}

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export interface FooterColumn {
    id: string;
    title: string;
    links: readonly NavLink[];
}

export type DashboardIcon =
    "home" | "accounts" | "payments" | "cards" | "treasury" | "reports";

export interface DashboardNavItem {
    id: DashboardIcon;
    label: string;
}

export interface SeriesFrame {
    min: number;
    max: number;
    start: number;
    total: number;
}
