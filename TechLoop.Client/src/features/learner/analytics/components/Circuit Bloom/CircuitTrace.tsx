interface CircuitTraceProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    active?: boolean;
}

export default function CircuitTrace({
                                         x1,
                                         y1,
                                         x2,
                                         y2,
                                         active = false,
                                     }: CircuitTraceProps) {
    const midY = (y1 + y2) / 2;

    return (
        <path
            d={`M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`}
            fill="none"
            stroke={active ? "#17D4C3" : "#234466"}
            strokeWidth={active ? 2 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={active ? 0.85 : 0.45}
        />
    );
}