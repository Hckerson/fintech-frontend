export interface ChartPoint {
    label: string;
    value: number;
    display: string;
    tick?: string;
    partial?: boolean;
}

export interface ChartMarker {
    label: string;
    at: string;
}

export interface FlowPoint {
    label: string;
    inflow: number;
    outflow: number;
    net: number;
    display: { inflow: string; outflow: string; net: string };
}

export interface FlowLabels {
    period: string;
    inflow: string;
    outflow: string;
    net: string;
    toggle: string;
}
