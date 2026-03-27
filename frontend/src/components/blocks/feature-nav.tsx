import React, { useState } from 'react';
import { BarChart2, Briefcase, Globe, FileText, CircleDollarSign, X } from 'lucide-react';

// 1. Define the Feature interface
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
}

export default function FeatureNavigation({ activeId, onActionSelect }: { activeId?: string, onActionSelect?: (id: string) => void }) {
  // Modal states for placeholders
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // 2. Component Data & Functional Specifications
  const features = [
    {
      id: 'cv-scoring',
      title: 'CV Scoring (ATS)',
      description: 'Analyze your resume with AI-powered insights',
      icon: BarChart2,
      action: () => {
        // If integrating with a parent component (like App.jsx) to show the main upload area
        if (onActionSelect) onActionSelect('cv-scoring');
      }
    },
    {
      id: 'resume-builder',
      title: 'AI Resume Builder',
      description: 'Craft a professional resume in minutes',
      icon: Briefcase,
      action: () => {
        if (onActionSelect) onActionSelect('resume-builder');
      }
    },
    {
      id: 'job-matching',
      title: 'Job Matching Score',
      description: 'See how well you fit a specific role',
      icon: Globe,
      action: () => {
        if (onActionSelect) onActionSelect('job-matching');
      }
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Generator',
      description: 'Auto-generate tailored cover letters',
      icon: FileText,
      action: () => {
        if (onActionSelect) onActionSelect('cover-letter');
      }
    },
    {
      id: 'salary',
      title: 'Salary Estimator',
      description: 'Discover your market value',
      icon: CircleDollarSign,
      action: () => {
        if (onActionSelect) onActionSelect('salary');
      }
    }
  ];

  return (
    <>
      <div className="w-full max-w-5xl mx-auto py-8 text-foreground selection:bg-primary/30">
        
        {/* Navigation Container */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-[2px] bg-zinc-800/50 -z-10" />
          
          <div className="flex overflow-x-auto hide-scrollbar md:justify-between gap-4 pb-8 px-4 md:px-0 snap-x">
            {features.map((feature) => {
              const isActive = activeId === feature.id;
              
              return (
                <div 
                  key={feature.id}
                  onClick={feature.action}
                  className="group flex flex-col items-center cursor-pointer min-w-[140px] md:min-w-[160px] snap-center select-none"
                >
                  {/* Icon Container */}
                  <div 
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ease-out border-4 shadow-xl
                      ${isActive 
                        ? 'bg-[#FFE4C4] text-black border-zinc-950 scale-110 shadow-[#FFE4C4]/20' 
                        : 'bg-zinc-800/50 text-zinc-400 border-zinc-900 group-hover:bg-zinc-800 group-hover:border-zinc-800 group-hover:text-zinc-200'
                      }
                    `}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  
                  {/* Title */}
                  <h3 className={`font-semibold text-sm text-center transition-colors duration-300 ${isActive ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                    {feature.title}
                  </h3>
                  
                  {/* Description (Expands on hover/active) */}
                  <div 
                    className={`
                      grid transition-all duration-300 ease-in-out
                      ${isActive ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:mt-2'}
                    `}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs text-zinc-500 text-center max-w-[130px] leading-relaxed px-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Placeholders for Functional Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/50 bg-zinc-900/20">
              <h2 className="text-xl font-bold text-zinc-100">
                {features.find(f => f.id === activeModal)?.title}
              </h2>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Routing */}
            <div className="p-6">
              {activeModal === 'resume-builder' && (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm">Initiating slide-over form for resume data extraction...</p>
                  <div className="h-32 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 bg-zinc-900/50">
                    [ Multi-Step Resume Form Placeholder ]
                  </div>
                </div>
              )}

              {activeModal === 'job-matching' && (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm">Paste a job description or URL to compare against your profile.</p>
                  <textarea 
                    className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-[#FFE4C4] focus:ring-1 focus:ring-[#FFE4C4] transition-all resize-none"
                    placeholder="E.g., We are looking for a Senior Software Engineer with..."
                  />
                  <button className="w-full bg-[#FFE4C4] text-black font-semibold py-3 rounded-lg hover:bg-[#FFE4C4]/90 transition-colors">
                    Calculate Match Score
                  </button>
                </div>
              )}

              {activeModal === 'cover-letter' && (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm">Please provide target details to generate your tailored cover letter.</p>
                  <input 
                    type="text" 
                    placeholder="Target Company (e.g. Google)" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-[#FFE4C4]"
                  />
                  <input 
                    type="text" 
                    placeholder="Target Role (e.g. Frontend Developer)" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-[#FFE4C4]"
                  />
                  <button className="w-full bg-[#FFE4C4] text-black font-semibold py-3 rounded-lg hover:bg-[#FFE4C4]/90 transition-colors">
                    Generate with AI
                  </button>
                </div>
              )}

              {activeModal === 'salary' && (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm">Enter your details to calculate estimated market brackets.</p>
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none">
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Product Manager</option>
                    <option>Data Scientist</option>
                  </select>
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none">
                    <option>Entry Level (0-2 YOE)</option>
                    <option>Mid Level (3-5 YOE)</option>
                    <option>Senior Level (5+ YOE)</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Location (e.g. San Francisco, CA)" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-[#FFE4C4]"
                  />
                  <button className="w-full bg-[#FFE4C4] text-black font-semibold py-3 rounded-lg hover:bg-[#FFE4C4]/90 transition-colors">
                    Fetch Estimates
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
