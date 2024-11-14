'use client';

import { useState } from 'react';

export default function Page() {
    const [cattleCount, setCattleCount] = useState(0);
    const [season, setSeason] = useState('summer');
    const [dietDistribution, setDietDistribution] = useState({
        hay: 65,
        corn: 20,
        grass: 10,
        seaweed: 5,
    });

    // Simplified calculation - these would need to be refined with actual scientific data
    const calculateMethane = () => {
        const baseEmission = 0.25; // base m³ per cow per day

        let seasonMultiplier = {
            summer: 1.2,
            winter: 0.8,
            spring: 1.0,
            fall: 1.0,
        }[season];

        // Calculate without seaweed
        const dietMultiplierNoSeaweed =
            (dietDistribution.hay * 1.1 +
                dietDistribution.corn * 0.9 +
                dietDistribution.grass * 1.0) /
            (100 - dietDistribution.seaweed); // Normalize to 100%

        // Calculate with seaweed
        const dietMultiplierWithSeaweed =
            ((dietDistribution.hay * 1.1 +
                dietDistribution.corn * 0.9 +
                dietDistribution.grass * 1.0) *
                (1 - dietDistribution.seaweed * 0.02)) /
            100;

        if (seasonMultiplier === undefined) {
            seasonMultiplier = 1.0;
        }

        const dailyEmissionNoSeaweed = Math.max(
            baseEmission * cattleCount * seasonMultiplier * dietMultiplierNoSeaweed,
            0,
        );

        const dailyEmissionWithSeaweed = Math.max(
            baseEmission * cattleCount * seasonMultiplier * dietMultiplierWithSeaweed,
            0,
        );

        return {
            daily: {
                without: dailyEmissionNoSeaweed.toFixed(2),
                with: dailyEmissionWithSeaweed.toFixed(2),
            },
            monthly: {
                without: (dailyEmissionNoSeaweed * 30).toFixed(2),
                with: (dailyEmissionWithSeaweed * 30).toFixed(2),
            },
            yearly: {
                without: (dailyEmissionNoSeaweed * 365).toFixed(2),
                with: (dailyEmissionWithSeaweed * 365).toFixed(2),
            },
        };
    };

    const getEmissionGrade = () => {
        if (cattleCount === 0)
            return {
                grade: 'N/A',
                color: 'text-gray-400',
                bgColor: 'bg-gray-400/10',
            };

        const emissionsPerCow = parseFloat(calculateMethane().daily.with) / cattleCount;

        if (emissionsPerCow <= 0.15)
            return {
                grade: 'A',
                color: 'text-green-400',
                bgColor: 'bg-green-400/10',
            };
        if (emissionsPerCow <= 0.2)
            return {
                grade: 'B',
                color: 'text-emerald-400',
                bgColor: 'bg-emerald-400/10',
            };
        if (emissionsPerCow <= 0.25)
            return {
                grade: 'C',
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-400/10',
            };
        if (emissionsPerCow <= 0.3)
            return {
                grade: 'D',
                color: 'text-orange-400',
                bgColor: 'bg-orange-400/10',
            };
        if (emissionsPerCow <= 0.35)
            return {
                grade: 'E',
                color: 'text-red-300',
                bgColor: 'bg-red-300/10',
            };
        return {
            grade: 'F',
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
        };
    };

    const results = calculateMethane();
    const grade = getEmissionGrade();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                        CowCulator v2
                    </h1>
                    <p className="text-gray-400 text-xl">
                        Cattle Methane Emission Estimation System
                    </p>
                </div>

                {/* Input Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm">
                    <div className="space-y-6">
                        <label className="block">
                            <span className="text-gray-300">Number of Cattle</span>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2"
                                value={cattleCount || ''}
                                placeholder="0"
                                onChange={(e) => setCattleCount(Number(e.target.value))}
                            />
                        </label>

                        <label className="block">
                            <span className="text-gray-300">Season</span>
                            <select
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2"
                                value={season}
                                onChange={(e) => setSeason(e.target.value)}
                            >
                                <option value="summer">Summer</option>
                                <option value="winter">Winter</option>
                                <option value="spring">Spring</option>
                                <option value="fall">Fall</option>
                            </select>
                        </label>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-gray-300">Diet Distribution (%)</h3>
                        {Object.entries(dietDistribution).map(([food, percentage]) => (
                            <label key={food} className="block">
                                <span className="text-gray-400 capitalize">
                                    {food === 'seaweed' ? 'Red Seaweed' : food}
                                </span>
                                <span
                                    className={`ml-2 ${percentage > 20 && food == 'seaweed' ? 'text-red-300' : ''}`}
                                >
                                    {percentage}%
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={percentage}
                                    onChange={(e) => {
                                        setDietDistribution((prev) => ({
                                            ...prev,
                                            [food]: Number(e.target.value),
                                        }));
                                    }}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Results Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(results).map(([period, values]) => (
                        <div
                            key={period}
                            className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm"
                        >
                            <h3 className="text-gray-400 capitalize mb-4">{period} Emissions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-400">Without Red Seaweed:</p>
                                    <p className="text-2xl font-bold text-emerald-400">
                                        {values.without} m³
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">With Red Seaweed:</p>
                                    <p className="text-2xl font-bold text-cyan-400">
                                        {values.with} m³
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Card and Grade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/30 p-8 rounded-xl h-full flex items-center">
                        <p className="text-sm text-gray-400 leading-relaxed">
                            This calculator provides estimates based on simplified models. Actual
                            methane emissions may vary with factors like animal age, health, and
                            feed composition. Red seaweed (Asparagopsis taxiformis) can
                            significantly reduce methane emissions in cattle when used as a feed
                            supplement.
                        </p>
                    </div>
                    <div className="bg-gray-800/30 p-8 rounded-xl h-full flex flex-col items-center justify-center">
                        <span className="text-gray-300 text-lg mb-3">
                            Environmental Impact Grade
                        </span>
                        <div className={`${grade.bgColor} px-8 py-4 rounded-lg`}>
                            <span className={`text-5xl font-bold ${grade.color}`}>
                                {grade.grade}
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="font-bold underline text-cyan-400">
                        <a href="https://forms.gle/Lr3zY2AEwErUmSeN7">Feedback Form</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
