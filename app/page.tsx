'use client';

import { useState } from 'react';

export default function Page() {
    const [cattleCount, setCattleCount] = useState(0);
    const [season, setSeason] = useState('summer');
    const [dietDistribution, setDietDistribution] = useState({
        hay: 65,
        corn: 20,
        grass: 10,
        seaweed: 5, // Added red seaweed with initial 5%
    });

    // Simplified calculation - these would need to be refined with actual scientific data
    const calculateMethane = () => {
        const baseEmission = 0.25; // base m³ per cow per day
        const seasonMultiplier = {
            summer: 1.2,
            winter: 0.8,
            spring: 1.0,
            fall: 1.0,
        }[season];

        // Updated calculation to account for seaweed's methane-reducing properties
        const dietMultiplier =
            ((dietDistribution.hay * 1.1 +
                dietDistribution.corn * 0.9 +
                dietDistribution.grass * 1.0) *
                (1 - dietDistribution.seaweed * 0.02)) / // Seaweed reduces emissions by roughly 2% per 1% included
            100;

        const dailyEmission = baseEmission * cattleCount * seasonMultiplier * dietMultiplier;
        return {
            daily: dailyEmission.toFixed(2),
            monthly: (dailyEmission * 30).toFixed(2),
            yearly: (dailyEmission * 365).toFixed(2),
        };
    };

    const results = calculateMethane();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                        CowCulator AI
                    </h1>
                    <p className="text-gray-400 text-xl">
                        Advanced Cattle Methane Emission Estimation System
                    </p>
                </div>

                {/* Input Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm">
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-gray-300">Number of Cattle</span>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                                value={cattleCount || ''}
                                placeholder="0"
                                onChange={(e) => setCattleCount(Number(e.target.value))}
                            />
                        </label>

                        <label className="block">
                            <span className="text-gray-300">Season</span>
                            <select
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
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
                                <span className="ml-2">{percentage}%</span>
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
                    {Object.entries(results).map(([period, value]) => (
                        <div
                            key={period}
                            className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm"
                        >
                            <h3 className="text-gray-400 capitalize mb-2">{period} Emissions</h3>
                            <p className="text-2xl font-bold text-emerald-400">{value} m³</p>
                        </div>
                    ))}
                </div>

                {/* Info Card */}
                <div className="bg-gray-800/30 p-6 rounded-xl text-sm text-gray-400">
                    <p>
                        This calculator provides estimates based on simplified models. Actual
                        methane emissions may vary based on additional factors such as animal age,
                        health, and specific feed compositions. Red seaweed (Asparagopsis
                        taxiformis) has been shown to significantly reduce methane emissions in
                        cattle when used as a feed supplement.
                    </p>
                </div>
            </div>
        </div>
    );
}
