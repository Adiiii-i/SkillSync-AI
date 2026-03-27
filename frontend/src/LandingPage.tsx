import React, { useState, useEffect } from 'react';
import { DottedSurface } from "@/components/ui/dotted-surface";
import { HeroSection } from "@/components/blocks/hero-section-4";
import { DotLoader } from "@/components/ui/dot-loader";

const gameFrames = [
    [14, 7, 0, 8, 6, 13, 20], [14, 7, 13, 20, 16, 27, 21], [14, 20, 27, 21, 34, 24, 28],
    [27, 21, 34, 28, 41, 32, 35], [34, 28, 41, 35, 48, 40, 42], [34, 28, 41, 35, 48, 42, 46],
    [34, 28, 41, 35, 48, 42, 38], [34, 28, 41, 35, 48, 30, 21], [34, 28, 41, 48, 21, 22, 14],
    [34, 28, 41, 21, 14, 16, 27], [34, 28, 21, 14, 10, 20, 27], [28, 21, 14, 4, 13, 20, 27],
    [28, 21, 14, 12, 6, 13, 20], [28, 21, 14, 6, 13, 20, 11], [28, 21, 14, 6, 13, 20, 10],
    [14, 6, 13, 20, 9, 7, 21],
];

export function LandingPage({ onEnter }: { onEnter: () => void }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden" style={{fontFamily: 'var(--font-base)'}}>
            {isLoading ? (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0A0A0F] transition-opacity duration-500">
                    <div className="flex flex-col items-center gap-5 rounded px-4 py-3 text-white">
                        <DotLoader frames={gameFrames} className="gap-0.5" dotClassName="bg-white/15 [&.active]:bg-[#00FFB2] size-1.5" />
                        <p className="font-medium animate-pulse mt-4 text-[#A0A0B8]">Loading Experience...</p>
                    </div>
                </div>
            ) : (
                <>
                    <DottedSurface className="absolute inset-0 size-full z-0 opacity-50 block dark:block" />
                    <div className="relative z-10 animate-in fade-in zoom-in-95 duration-700">
                        <HeroSection onAction={onEnter} />
                    </div>
                </>
            )}
        </main>
    );
}
