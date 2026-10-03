const MULTIPLES = [1, 2, 2.5, 5, 10];

export const niceScale = (min: number, max: number, steps: number) => {
    const raw = (max - min || Math.abs(max) || 1) / steps;
    const power = 10 ** Math.floor(Math.log10(raw));
    const step =
        MULTIPLES.map((multiple) => multiple * power).find(
            (candidate) => candidate >= raw,
        ) ?? raw;
    const floor = Math.floor(min / step) * step;
    const count = Math.max(Math.ceil((max - floor) / step), 1);

    return Array.from(
        { length: count + 1 },
        (_, index) => floor + index * step,
    );
};
