interface CircuitNodeProps {
    x: number;
    y: number;
    radius: number;
    label: string;
    successfulAttempts: number;
    failedAttempts: number;
    selected?: boolean;
    onClick?: () => void;
}

export default function CircuitNode({
                                        x,
                                        y,
                                        radius,
                                        label,
                                        successfulAttempts,
                                        failedAttempts,
                                        selected = false,
                                        onClick,
                                    }: CircuitNodeProps) {
    return (
        <g
            onClick={onClick}
            className="cursor-pointer"
            role="button"
        >
            <circle
                cx={x}
                cy={y}
                r={radius + 9}
                fill="none"
                stroke={selected ? "#17D4C3" : "#17354b"}
                strokeWidth={selected ? 2.5 : 1.5}
                opacity={selected ? 1 : 0.8}
            />

            <circle
                cx={x}
                cy={y}
                r={radius}
                fill="#0d2931"
                stroke="#17D4C3"
                strokeWidth={2}
            />

            <circle
                cx={x}
                cy={y}
                r={4}
                fill="#17D4C3"
            />

            {failedAttempts > 0 && (
                <circle
                    cx={x + radius - 4}
                    cy={y - radius + 4}
                    r={6}
                    fill="#e05c5c"
                />
            )}

            <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="#e8f0fe"
                fontSize="12"
                fontWeight="600"
            >
                {label.length > 13
                    ? `${label.slice(0, 13)}…`
                    : label}
            </text>

            <text
                x={x}
                y={y + radius + 21}
                textAnchor="middle"
                fill="#617b9d"
                fontSize="10"
            >
                {successfulAttempts} accepted
            </text>
        </g>
    );
}