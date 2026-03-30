// Author: Aadi (@Adiiii-i)
// Skillify - Orbital Navigation
import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart2, 
  Briefcase, 
  FileText, 
  Zap,
  Link,
  ArrowRight,
  Target,
  Send
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Feature {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: string[];
  status: "available" | "in_development" | "pending";
  energy: number;
  date: string;
}

interface FeatureNavProps {
  activeId?: string;
  onActionSelect?: (id: string) => void;
}

const features: Feature[] = [
  {
    id: 'cv-scoring',
    title: 'CV Scoring (ATS)',
    description: 'Analyze your resume with AI-powered insights',
    content: 'Get instant feedback on your resume based on ATS standards, including keyword optimization, formatting, and overall impact.',
    category: 'Analysis',
    icon: BarChart2,
    relatedIds: ['resume-builder', 'job-matching'],
    status: 'available',
    energy: 95,
    date: 'Active'
  },
  {
    id: 'resume-builder',
    title: 'AI Resume Builder',
    description: 'Craft a professional resume in minutes',
    content: 'Generate a highly converting resume tailored to your target role using our advanced AI templates and suggestions.',
    category: 'Generation',
    icon: Briefcase,
    relatedIds: ['cv-scoring', 'cover-letter'],
    status: 'available',
    energy: 85,
    date: 'Active'
  },
  {
    id: 'upskill',
    title: 'Skill Gap Roadmap',
    description: 'Find exactly what skills you are missing',
    content: 'Compare your resume against the JD to identify the exact gaps and discover actionable steps to become the perfect candidate.',
    category: 'Analysis',
    icon: Target,
    relatedIds: ['cv-scoring', 'outreach'],
    status: 'available',
    energy: 70,
    date: 'Active'
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter Generator',
    description: 'Auto-generate tailored cover letters',
    content: 'Let our AI write a compelling, personalized cover letter that highlights your strongest relevant achievements in seconds.',
    category: 'Generation',
    icon: FileText,
    relatedIds: ['resume-builder'],
    status: 'in_development',
    energy: 40,
    date: 'Q4 2026'
  },
  {
    id: 'outreach',
    title: 'Cold Email / DM Generator',
    description: 'Craft perfect reach-outs',
    content: 'Generate short, punchy outreach messages designed to connect with hiring managers and recruiters.',
    category: 'Outreach',
    icon: Send,
    relatedIds: ['upskill'],
    status: 'pending',
    energy: 15,
    date: 'Q1 2027'
  }
];

export default function FeatureNavigation({ activeId, onActionSelect }: FeatureNavProps) {
  // basic rotation state for the orbital ring
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate the orbital
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (autoRotate) {
      timer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.15) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRotate]);

  // When a node is selected, rotate it to the top (270°)
  const centerOnNode = (index: number) => {
    const targetAngle = (index / features.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const handleSelect = (feature: Feature, index: number) => {
    setAutoRotate(false);
    centerOnNode(index);
    onActionSelect?.(feature.id);

    // Resume auto-rotate after a pause if you want it to eventually rotate again
    // For a detailed card, we might want to keep it still while viewing
    // setTimeout(() => setAutoRotate(true), 6000);
  };

  const calculatePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 180; // slightly larger radius for detailed view
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    // Depth simulation: nodes at the top appear "further" (smaller/dimmer)
    const depth = (1 + Math.sin(radian)) / 2; // 0 = far, 1 = near
    const scale = 0.7 + 0.3 * depth;
    const opacity = 0.4 + 0.6 * depth;
    const zIndex = Math.round(50 + 50 * depth);

    return { x, y, scale, opacity, zIndex, angle };
  };

  const getStatusStyles = (status: Feature['status']): string => {
    switch (status) {
      case 'available':
        return 'bg-[#191970]/10 text-[#191970] border-[#191970]/30';
      case 'in_development':
        return 'bg-[#191970]/5 text-[#191970]/70 border-[#191970]/20';
      case 'pending':
        return 'bg-[#f5f7f8] text-[#191970]/60 border-[#e1e4e6]';
      default:
        return 'bg-[#f5f7f8] text-[#191970]/60 border-[#e1e4e6]';
    }
  };

  return (
    <div className="w-full py-16 flex justify-center overflow-hidden" ref={containerRef}>
      <div 
        className="relative flex items-center justify-center mt-20 md:mt-16"
        style={{ width: '480px', height: '480px' }}
      >
        {/* Orbit ring */}
        <div 
          className="absolute rounded-full border border-[#191970]/10"
          style={{ width: '360px', height: '360px' }}
        />

        {/* Center glow sphere */}
        <div className="absolute w-12 h-12 rounded-full flex items-center justify-center z-10">
          <div 
            className="w-12 h-12 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #191970, #252585, #191970)',
              animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              boxShadow: '0 0 30px rgba(25, 25, 112, 0.2)',
            }}
          />
          <div 
            className="absolute w-5 h-5 rounded-full"
            style={{ background: 'rgba(236, 239, 241, 0.9)', backdropFilter: 'blur(8px)' }}
          />
          {/* Ping rings */}
          <div 
            className="absolute w-16 h-16 rounded-full border border-[#191970]/10"
            style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
          />
          <div 
            className="absolute w-20 h-20 rounded-full border border-[#191970]/5"
            style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.7s' }}
          />
        </div>

        {/* Orbital nodes */}
        {features.map((feature, index) => {
          const pos = calculatePosition(index, features.length);
          const isActive = activeId === feature.id;
          const isHovered = hoveredId === feature.id;
          const Icon = feature.icon;

          return (
            <div
              key={feature.id}
              className="absolute cursor-pointer"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${isActive ? 1.15 : pos.scale})`,
                opacity: isActive ? 1 : pos.opacity,
                zIndex: isActive ? 200 : pos.zIndex,
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
              }}
              onClick={() => handleSelect(feature, index)}
              onMouseEnter={() => { setHoveredId(feature.id); if (!isActive) setAutoRotate(false); }}
              onMouseLeave={() => { setHoveredId(null); if (!isActive) setAutoRotate(true); }}
            >
              {/* Glow behind active node */}
              {isActive && (
                <div 
                  className="absolute -inset-4 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,228,196,0.25) 0%, transparent 70%)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                />
              )}

              {/* Icon circle */}
              <div 
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10
                  ${isActive 
                    ? 'bg-[#191970] text-[#ECEFF1] border-transparent shadow-[0_0_24px_rgba(25,25,112,0.3)]' 
                    : isHovered
                    ? 'bg-[#f5f7f8] text-[#191970] border-[#191970]/40'
                    : 'bg-[#f5f7f8] text-[#191970]/70 border-[#191970]/10'
                  }
                `}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Label (only visible when not active to avoid double titles with card) */}
              <div 
                className={`
                  absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-all duration-300
                  ${!isActive ? 'opacity-70' : 'opacity-0'}
                `}
              >
                <span className="text-xs font-semibold tracking-wide text-[#191970]/60 group-hover:text-[#191970]">
                  {feature.title}
                </span>
              </div>

              {/* Detail Card (visible when active) */}
              {isActive && (
                <Card className="absolute top-[80px] left-1/2 -translate-x-1/2 w-72 bg-[#f5f7f8]/95 backdrop-blur-xl border-[#191970]/20 shadow-2xl shadow-black/5 overflow-visible" style={{ zIndex: 300, transform: 'scale(1)', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-zinc-700/60"></div>
                  
                  <CardHeader className="pb-3 px-5 pt-5">
                    <div className="flex justify-between items-center mb-1">
                      <Badge className={`px-2 py-0 h-5 text-[10px] uppercase font-bold tracking-wider ${getStatusStyles(feature.status)}`}>
                        {feature.status.replace('_', ' ')}
                      </Badge>
                      <span className="font-mono text-xs text-[#191970]/50">{feature.date}</span>
                    </div>
                    <CardTitle className="text-[17px] mt-2 text-[#191970] font-semibold tracking-tight">{feature.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="px-5 pb-5 text-sm text-[#191970]/80">
                    <p className="leading-relaxed text-[13px]">{feature.content}</p>

                    <div className="mt-5 pt-4 border-t border-[#191970]/10">
                      <div className="flex justify-between items-center text-[10px] mb-2 uppercase tracking-wider text-[#191970]/60 font-medium">
                        <span className="flex items-center">
                          <Zap size={11} className="mr-1.5" />
                          Energy Level
                        </span>
                        <span className="font-mono">{feature.energy}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#191970]/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#191970] to-[#252585]" 
                          style={{ width: `${feature.energy}%`, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        ></div>
                      </div>
                    </div>

                    {feature.relatedIds.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-[#191970]/10">
                        <div className="flex items-center mb-2.5">
                          <Link size={11} className="text-[#191970]/60 mr-1.5" />
                          <h4 className="text-[10px] uppercase tracking-wider font-medium text-[#191970]/60">Connected Nodes</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {feature.relatedIds.map(relId => {
                            const rel = features.find(f => f.id === relId);
                            if (!rel) return null;
                            return (
                              <Button 
                                key={rel.id}
                                variant="outline"
                                size="sm"
                                className="h-7 px-2.5 text-[11px] rounded-md border-[#191970]/20 bg-[#191970]/5 hover:bg-[#191970]/10 hover:border-[#191970]/30 text-[#191970]/70 hover:text-[#191970] transition-colors"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  const i = features.findIndex(f => f.id === rel.id); 
                                  if(i !== -1) handleSelect(rel, i); 
                                }}
                              >
                                {rel.title} <ArrowRight size={10} className="ml-1.5 opacity-60" />
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
