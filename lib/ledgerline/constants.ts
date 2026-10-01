export const LEDGERLINE_THEME_CLASS = "theme-ledgerline";

export const LEDGERLINE_THEME_COLOR = "#07090d";

export const LEDGERLINE_LOCALE = "en-GB";

export const FRACTION_DIGITS = 2;

export const MINOR_UNITS = 10 ** FRACTION_DIGITS;

export const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

export const WORD_DURATION = 0.9;

export const WORD_STAGGER = 0.04;

export const REVEAL = { seconds: 0.9, offset: 18, stagger: 0.08 } as const;

export const LINE_DRAW_SECONDS = 2.2;

export const FORECAST_DELAY = 1.3;

export const POINTER_SPRING = {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
} as const;

export const SCROLL_SPRING = {
    stiffness: 80,
    damping: 26,
    restDelta: 0.0005,
} as const;

export const HERO_CUES = {
    badge: 0.1,
    lines: 0.2,
    lineStagger: 0.12,
    body: 0.5,
    actions: 0.65,
    frame: 0.8,
    chart: 1.3,
} as const;

export const LINE_SECONDS = 1.1;

export const FRAME_MOTION = {
    offset: ["start end", "start 15%"],
    tilt: [22, 0],
    scale: [0.9, 1],
    pointerTilt: 3,
    enter: 40,
    enterSeconds: 1.3,
} as const;

export const HERO_RECEDE = {
    range: [0.5, 1],
    lift: -56,
    fade: 0.15,
    glow: [0.35, 1],
} as const;

export const NAV_SOLID_AFTER = 24;

export const LOGO_PATH = "M2 17 C6 17 7 9 11 9 S16 14 22 5";

export const CHART = { width: 640, height: 220, pad: 8 } as const;

export const CHART_GRIDLINES = [0.25, 0.5, 0.75] as const;

export const FOOTER_CHART = { width: 320, height: 72, pad: 4 } as const;

export const RULE_CHART = { width: 2400, height: 80, pad: 8 } as const;

export const AUTH_CHART = { width: 1440, height: 640, pad: 64, padX: 0 } as const;

export const STATUS_CHART = { width: 2400, height: 480, pad: 32 } as const;

export const STATUS_BREAK_AT = 17;

export const FORECAST_CHART = { width: 720, height: 260, pad: 12 } as const;

export const APPROVAL_SECONDS = 0.6;

export const MATCH_STAGGER = 0.28;
