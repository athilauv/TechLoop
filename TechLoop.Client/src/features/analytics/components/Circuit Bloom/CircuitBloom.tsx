import { useMemo, useState } from "react";
import type { TechnologyPractice, TopicAnalytics,} from "../../../../types/analytics.types";
import CircuitLegend from "./CircuitLegend";
import CircuitNode from "./CircuitNode";
import CircuitTrace from "./CircuitTrace";

interface CircuitBloomProps {
    technologies: TechnologyPractice[];
    topics: TopicAnalytics[];
}

interface BloomNode {
    technologyId: number;
    label: string;
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    x: number;
    y: number;
    radius: number;
}

export default function CircuitBloom({
                                         technologies,
                                         topics,
                                     }: CircuitBloomProps) {
    const [selectedTechnologyId, setSelectedTechnologyId] =
        useState<number | null>(null);

    const width = 900;
    const height = 390;

    const nodes = useMemo<BloomNode[]>(() => {
        const visibleTechnologies = technologies.slice(0, 7);

        if (visibleTechnologies.length === 0) {
            return [];
        }

        const centerX = width / 2;
        const centerY = height / 2;

        const horizontalRadius = 275;
        const verticalRadius = 135;

        return visibleTechnologies.map((technology, index) => {
            const angle =
                (index / visibleTechnologies.length) *
                Math.PI *
                2 -
                Math.PI / 2;

            const activityLevel =
                technology.totalAttempts > 0
                    ? Math.min(
                        technology.totalAttempts / 20,
                        1
                    )
                    : 0;

            const radius =
                34 + Math.round(activityLevel * 10);

            return {
                technologyId: technology.technologyId,
                label: technology.technologyName,
                totalAttempts: technology.totalAttempts,
                successfulAttempts:
                technology.successfulAttempts,
                failedAttempts:
                technology.failedAttempts,
                x:
                    centerX +
                    Math.cos(angle) *
                    horizontalRadius,
                y:
                    centerY +
                    Math.sin(angle) *
                    verticalRadius,
                radius,
            };
        });
    }, [technologies]);

    const selectedNode =
        nodes.find(
            (node) =>
                node.technologyId ===
                selectedTechnologyId
        ) ?? null;

    if (nodes.length === 0) {
        return (
            <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                        Circuit Bloom
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-white">
                        Your learning network
                    </h2>

                    <p className="mt-1 text-xs text-[#617b9d]">
                        Technologies will appear here as you
                        practice.
                    </p>
                </div>

                <div className="mt-6 rounded-xl border border-dashed border-[#1e3254] p-10 text-center">
                    <p className="text-sm text-[#7189a8]">
                        No technology practice data yet.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                        Circuit Bloom
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-white">
                        Your learning network
                    </h2>

                    <p className="mt-1 max-w-xl text-xs text-[#617b9d]">
                        Your technologies connected through
                        practice activity.
                    </p>
                </div>

                <div className="rounded-lg border border-[#1e3254] bg-[#0b182b] px-4 py-2 text-right">
                    <p className="text-lg font-bold text-white">
                        {technologies.length}
                    </p>

                    <p className="text-[9px] uppercase tracking-wide text-[#617b9d]">
                        Technologies
                    </p>
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="h-auto min-w-[720px] w-full"
                >
                    {nodes.map((node, index) => {
                        const nextNode =
                            nodes[
                            (index + 1) %
                            nodes.length
                                ];

                        return (
                            <CircuitTrace
                                key={`trace-${node.technologyId}`}
                                x1={node.x}
                                y1={node.y}
                                x2={nextNode.x}
                                y2={nextNode.y}
                                active={
                                    node.successfulAttempts >
                                    0 &&
                                    nextNode.successfulAttempts >
                                    0
                                }
                            />
                        );
                    })}

                    {nodes.map((node) => (
                        <CircuitNode
                            key={`node-${node.technologyId}`}
                            x={node.x}
                            y={node.y}
                            radius={node.radius}
                            label={node.label}
                            successfulAttempts={
                                node.successfulAttempts
                            }
                            failedAttempts={
                                node.failedAttempts
                            }
                            selected={
                                selectedTechnologyId ===
                                node.technologyId
                            }
                            onClick={() => {
                                setSelectedTechnologyId(
                                    selectedTechnologyId ===
                                    node.technologyId
                                        ? null
                                        : node.technologyId
                                );
                            }}
                        />
                    ))}
                </svg>
            </div>

            <div className="mt-2">
                <CircuitLegend />
            </div>

            {selectedNode && (
                <div className="mt-5 rounded-xl border border-[#1e3254] bg-[#0b182b] p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {selectedNode.label}
                            </p>

                            <p className="mt-1 text-xs text-[#617b9d]">
                                Practice performance
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setSelectedTechnologyId(
                                    null
                                )
                            }
                            className="text-xs text-[#617b9d] transition-colors hover:text-white"
                        >
                            Close
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="rounded-lg bg-[#081423] p-3">
                            <p className="text-lg font-semibold text-white">
                                {
                                    selectedNode.totalAttempts
                                }
                            </p>

                            <p className="text-[10px] text-[#617b9d]">
                                Attempts
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#081423] p-3">
                            <p className="text-lg font-semibold text-[#17D4C3]">
                                {
                                    selectedNode.successfulAttempts
                                }
                            </p>

                            <p className="text-[10px] text-[#617b9d]">
                                Successful
                            </p>
                        </div>

                        <div className="rounded-lg bg-[#081423] p-3">
                            <p className="text-lg font-semibold text-[#e05c5c]">
                                {
                                    selectedNode.failedAttempts
                                }
                            </p>

                            <p className="text-[10px] text-[#617b9d]">
                                Failed
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {topics.length > 0 && (
                <div className="mt-6 border-t border-[#1e3254] pt-5">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[1px] text-[#526d8e]">
                        Topics in your learning network
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {topics.slice(0, 8).map((topic) => (
                            <span
                                key={topic.topicId}
                                className="rounded-full border border-[#1e3254] bg-[#0b182b] px-3 py-1.5 text-[10px] text-[#7189a8]"
                            >
                                {topic.topicName}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}