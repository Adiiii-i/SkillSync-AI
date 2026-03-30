// Author: Aadi (@Adiiii-i)
// Skillify - Core UI
import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './index.css';
import {
  UploadCloud, Play, BarChart2, Briefcase, FileText,
  File as FileIcon, CheckCircle2,
  XCircle, AlertCircle, Loader2, Download, Copy, X,
  Target, Send, Globe, Printer, RotateCcw
} from 'lucide-react';
import FeatureNavigation from './components/blocks/feature-nav';
import { DotLoader } from './components/ui/dot-loader';
import { Entropy } from './components/ui/entropy';
import { Button } from './components/ui/button';
import ResumePreview from './components/ResumePreview';
import CoverLetterPreview from './components/CoverLetterPreview';
import { exportToPDF, exportViaPrint, exportToDocx } from './utils/pdfExport';
import { 
  analyzeAtsScore, buildTailoredResume,
  generateCoverLetter, generateSkillGap, generateOutreach 
} from './services/api';

const formatMarkdown = (text) => {
  if (!text) return '';
  try {
    const rawMarkup = marked(text);
    return DOMPurify.sanitize(rawMarkup);
  } catch (error) {
    console.error("Markdown rendering error:", error);
    return String(text); 
  }
};

const TABS = [
  { id: 'cv-scoring', name: 'CV Scoring (ATS)', desc: 'Analyze your resume with AI-powered insights', icon: BarChart2, prompt: 'Analyze this resume against standard ATS criteria. Score it out of 100.' },
  { id: 'resume-builder', name: 'AI Resume Builder', desc: 'Create a professional resume outline with AI', icon: Briefcase, prompt: 'Extract my resume data and formulate an optimized, professional resume structure.' },
  { id: 'upskill', name: 'Skill Gap Roadmap', desc: 'Identify exactly what skills you are missing for this role', icon: Target, prompt: 'Compare this resume against the job description to find missing skills and provide a roadmap.' },
  { id: 'cover-letter', name: 'Cover Letter Generator', desc: 'Generate a perfect cover letter in seconds', icon: FileText, prompt: 'Write a highly professional and compelling cover letter based precisely on my resume experience.' },
  { id: 'outreach', name: 'Outreach Generator', desc: 'Craft professional cold emails & DMs', icon: Send, prompt: 'Write a short, punchy cold outreach message targeting this exact role in both professional and creative tones.' },
];

const GAME_FRAMES = [
    [14, 7, 0, 8, 6, 13, 20],
    [14, 7, 13, 20, 16, 27, 21],
    [14, 20, 27, 21, 34, 24, 28],
    [27, 21, 34, 28, 41, 32, 35],
    [34, 28, 41, 35, 48, 40, 42],
    [34, 28, 41, 35, 48, 42, 46],
    [34, 28, 41, 35, 48, 42, 38],
    [34, 28, 41, 35, 48, 30, 21],
    [34, 28, 41, 48, 21, 22, 14],
    [34, 28, 41, 21, 14, 16, 27],
    [34, 28, 21, 14, 10, 20, 27],
    [28, 21, 14, 4, 13, 20, 27],
    [28, 21, 14, 12, 6, 13, 20],
    [28, 21, 14, 6, 13, 20, 11],
    [28, 21, 14, 6, 13, 20, 10],
    [14, 6, 13, 20, 9, 7, 21],
];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [modalContent, setModalContent] = useState(null); // privacy, terms, etc
  const [outreachTone, setOutreachTone] = useState('professional');
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF or DOCX file.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a resume file first.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    console.log("firing analysis for:", activeTab.id);

    try {
      let data;
      switch (activeTab.id) {
        case 'cv-scoring':
          data = await analyzeAtsScore(file, activeTab.prompt);
          break;
        case 'resume-builder':
          data = await buildTailoredResume(file, activeTab.prompt);
          break;
        case 'upskill':
          data = await generateSkillGap(file, jobDescription, activeTab.prompt);
          break;
        case 'cover-letter':
          data = await generateCoverLetter(file, jobDescription, activeTab.prompt);
          break;
        case 'outreach':
          data = await generateOutreach(file, jobDescription, activeTab.prompt);
          break;
        default:
          throw new Error("Unknown feature selected.");
      }
      setResult(data);
    } catch (err) {
      console.error("Backend is acting up:", err);
      setError(`Analysis Failed: ${err.message || 'Server exploded'}. Try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (method = 'pdf') => {
    if (!result) return;
    setDownloading(true);
    
    const content = activeTab.id === 'resume-builder' 
      ? (result.tailored_resume || result.recommendation)
      : (result.cover_letter || result.recommendation);
    
    if (!content) {
      setError("No content found to download.");
      setDownloading(false);
      return;
    }
      
    const fileName = `${activeTab.name.replace(/\s+/g, '_')}_Final`;
    
    try {
      if (method === 'pdf') {
        await exportToPDF({
          filename: `${fileName}.pdf`,
          elementId: activeTab.id === 'resume-builder' ? 'resume-content' : 'cover-letter-content',
        });
      } else if (method === 'print') {
        exportViaPrint(
          activeTab.id === 'resume-builder' ? 'resume-content' : 'cover-letter-content', 
          `${fileName}.pdf`
        );
      } else if (method === 'docx') {
        await exportToDocx(content, `${fileName}.docx`);
      }
    } catch (err) {
      console.error("Export failed:", err);
      setError("Failed to generate download. Please try the 'Print' method for maximum compatibility.");
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <div className="dark min-h-screen bg-background font-sans text-foreground pb-20 selection:bg-primary/30 relative overflow-hidden">
      {/* Background Entropy Effect */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-[0.12] flex items-center justify-center -z-10 translate-y-[-100px]">
         <Entropy size={1000} color="#191970" />
      </div>
      {/* Header */}
      <header className="bg-card text-card-foreground py-4 px-6 border-b border-border sticky top-0 z-50 overflow-x-auto w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between min-w-max gap-8 px-4">
          <div className="flex items-center gap-4 select-none">
            {/* Bold Premium Icon */}
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/assets/premium-logo.png" alt="SKILLIFY Icon" className="h-[52px] w-auto object-contain" />
            </div>
            <span className="font-display font-bold text-2xl tracking-widest text-[#191970] uppercase">SKILLIFY</span>
          </div>

          <nav className="flex items-center gap-4 lg:gap-8 text-sm font-medium text-muted-foreground overflow-x-auto whitespace-nowrap custom-scrollbar pb-2 pt-2 md:pb-0 md:pt-0 max-w-full">
            {TABS.map((tab) => (
               <a 
                 key={tab.id}
                 href={`#${tab.id}`}
                 onClick={(e) => { e.preventDefault(); setActiveTab(tab); /* setResult(null); */ setError(''); }}
                 className={`transition-colors flex-shrink-0 ${activeTab.id === tab.id ? "text-primary-foreground bg-primary px-4 py-2 rounded-full font-bold shadow-sm shadow-primary/20" : "hover:text-foreground md:px-2"}`}
               >
                 {tab.name}
               </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              <Globe className="w-4 h-4" />
              <span>English</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto mt-10 md:mt-16 px-4 md:px-6 mb-8 md:mb-12">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 tracking-tight text-foreground transition-all">{activeTab.name}</h1>
          <p className="text-muted-foreground text-base md:text-xl transition-all max-w-2xl mx-auto">{activeTab.desc}</p>
        </div>

        {/* Feature Stepper */}
        <FeatureNavigation 
          activeId={activeTab.id} 
          onActionSelect={(id) => {
            const selected = TABS.find(t => t.id === id);
            if (selected) {
              setActiveTab(selected);
              setResult(null);
              setError('');
            }
          }} 
        />

        {/* Dashboard Tools */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[600px]">
          
          {/* Left Column: Upload */}
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-xl font-bold mb-3 text-card-foreground">Select Resume for Analysis</h2>
            <p className="text-muted-foreground text-sm mb-6">Choose a sample resume below and click "CV Scoring (ATS)" to see our AI-powered analysis in action.</p>

            <div 
              className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center mb-6 hover:bg-muted/50 transition-colors cursor-pointer bg-card"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-4" />
              {file ? (
                <p className="font-medium text-primary truncate w-full text-center px-4">{file.name}</p>
              ) : (
                <>
                  <p className="font-semibold text-card-foreground mb-1">Click to upload your own resume</p>
                  <p className="text-xs text-muted-foreground">PDF or DOCX (max 5MB)</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
                accept=".pdf,.docx" 
              />
            </div>

            {/* Job Description Input */}
            <div className="mb-6">
              <div className="my-4 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                <span className="relative bg-card px-4 text-xs text-muted-foreground">add job description (optional)</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here for a more accurate, targeted analysis..."
                className="w-full min-h-[120px] resize-y p-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                Adding a JD helps our AI tailor the analysis to the specific role.
              </p>
            </div>

            <div className="mt-auto">
              {error && (
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 mb-6 group animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-destructive text-sm font-bold mb-1">Analysis Failed</p>
                      <p className="text-destructive/80 text-[11px] mb-3 leading-relaxed">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAnalyze} 
                        className="h-8 border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all bg-transparent"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-2" /> Retry Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${loading ? 'bg-muted text-muted-foreground cursor-not-allowed' : file ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {loading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Play className={`w-5 h-5 ${file ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                )}
                {loading ? 'Analyzing Profile...' : 'Analyze Resume'}
              </button>
            </div>
          </div>

          {/* Right Column: Preview / Results */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[500px]">
            {loading ? (
              <div className="flex-1 border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center bg-muted/20 p-12">
                 <div className="mb-6">
                    <DotLoader 
                      frames={GAME_FRAMES} 
                      duration={120} 
                      className="dot-loader-grid"
                    />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-2">Analyzing Profile...</h3>
                <p className="text-muted-foreground text-center max-w-sm">Our AI is processing your request. Please wait a moment while we map millions of data points.</p>
              </div>
            ) : result ? (
              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                {/* Results Screen */}
                <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6 md:p-8 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col gap-8">
                        {/* FEATURE: CV Scoring */}
                        {activeTab.id === 'cv-scoring' && (
                            <>
                                <div className="flex flex-col md:flex-row items-center gap-8 border-b border-border/50 pb-8">
                                    <div className="relative shrink-0">
                                        <svg className="w-32 h-32 transform -rotate-90">
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted" />
                                            <circle 
                                                cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                                strokeDasharray={2 * Math.PI * 56} 
                                                strokeDashoffset={2 * Math.PI * 56 * (1 - (result?.score || 0) / 100)} 
                                                className={result?.score >= 80 ? 'text-[#10b981]' : result?.score >= 60 ? 'text-[#f59e0b]' : 'text-destructive'} 
                                                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-foreground">{result?.score || 0}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ATS Score</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2 text-foreground">Resume Score Analysis</h3>
                                        <p className="text-muted-foreground mb-4">{result?.summary || "Here is the ATS breakdown of your resume."}</p>
                                        <div className="flex gap-3 flex-wrap">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold border border-primary/20">Parser Friendly</span>
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold border border-primary/20">Keyword Optimized</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                                        <h4 className="flex items-center gap-2 font-bold mb-3 text-foreground"><CheckCircle2 className="w-5 h-5 text-[#10b981]" /> Strengths</h4>
                                        <ul className="space-y-2">
                                            {result?.breakdown?.strengths?.map((str, i) => <li key={i} className="text-sm text-muted-foreground"> <span className="text-[#10b981] mr-1">•</span> {str}</li>) || <li className="text-sm italic">No specific strengths mapped.</li>}
                                        </ul>
                                    </div>
                                    <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                                        <h4 className="flex items-center gap-2 font-bold mb-3 text-foreground"><AlertCircle className="w-5 h-5 text-[#f59e0b]" /> Areas for Improvement</h4>
                                        <ul className="space-y-2">
                                            {result?.breakdown?.weaknesses?.map((weak, i) => <li key={i} className="text-sm text-muted-foreground"> <span className="text-[#f59e0b] mr-1">•</span> {weak}</li>) || <li className="text-sm italic">No specific gaps found.</li>}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* FEATURE: AI Resume Builder */}
                        {activeTab.id === 'resume-builder' && (
                            <>
                                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                   <div>
                                     <h3 className="text-2xl font-bold text-foreground">Your Tailored Resume</h3>
                                     <p className="text-muted-foreground text-sm mt-1">Ready for ATS parsing and professional applications.</p>
                                   </div>
                                     <div className="flex gap-2">
                                     <Button 
                                       variant="outline" 
                                       size="icon"
                                       className="hover:bg-muted text-foreground transition-colors" 
                                       title="Print ATS Copy" 
                                       onClick={() => handleDownload('print')}
                                     >
                                       <Printer className="w-4 h-4" />
                                     </Button>
                                     <Button 
                                       variant="outline"
                                       size="icon"
                                       className="hover:bg-muted text-foreground transition-colors" 
                                       title="Download Word Doc" 
                                       onClick={() => handleDownload('docx')}
                                     >
                                       <FileText className="w-4 h-4" />
                                     </Button>
                                     <Button 
                                       onClick={() => handleDownload('pdf')}
                                       disabled={downloading}
                                       className="flex items-center gap-2 border border-primary bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground font-semibold text-sm transition-all shadow-sm"
                                     >
                                       {downloading ? (
                                         <Loader2 className="w-4 h-4 animate-spin" />
                                       ) : (
                                         <Download className="w-4 h-4" /> 
                                       )}
                                       <span>{downloading ? 'Exporting...' : 'PDF'}</span>
                                     </Button>
                                   </div>
                                </div>
                                <div className="bg-card border border-border/50 rounded-lg overflow-hidden mt-4">
                                   <div className="bg-muted/50 px-4 py-2 border-b border-border text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-[#10b981]" /> Professional ATS View
                                   </div>
                                   <div className="p-0 scale-[0.85] md:scale-100 origin-top overflow-x-auto custom-scrollbar">
                                      <ResumePreview 
                                        data={result?.tailored_resume || result?.recommendation || "Generated resume content goes here."} 
                                        className="shadow-xl mx-auto"
                                      />
                                   </div>
                                </div>
                            </>
                        )}

                        {/* FEATURE: Skill Gap Roadmap (Upskill) */}
                        {activeTab.id === 'upskill' && (
                            <div className="flex flex-col gap-6">
                                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                                                <Target className="w-6 h-6 text-primary" /> Candidate Level
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">Based on JD compatibility</p>
                                        </div>
                                        <div className="text-3xl font-black text-primary">
                                            {result?.match_percentage || 0}%
                                        </div>
                                    </div>
                                    {/* Level Up Progress Bar */}
                                    <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-1000 ease-out"
                                            style={{ width: `${result?.match_percentage || 0}%` }}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-bold flex items-center gap-2 mb-4 text-foreground text-lg">
                                        <XCircle className="w-5 h-5 text-destructive" /> Critical Missing Skills
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {(result?.missing_skills || ['Loading...', 'Loading...', 'Loading...']).slice(0, 3).map((skill, i) => (
                                            <div key={i} className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                                                    <AlertCircle className="w-5 h-5 text-destructive" />
                                                </div>
                                                <span className="font-bold text-foreground">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mt-2">
                                    <h4 className="font-bold mb-2 flex items-center gap-2 text-primary">Next Steps Advice</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {result?.next_steps_advice || "Generating a career roadmap for you..."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* FEATURE: Cover Letter Generator */}
                        {activeTab.id === 'cover-letter' && (
                            <>
                                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                   <div>
                                     <h3 className="text-2xl font-bold text-foreground">Tailored Cover Letter</h3>
                                     <p className="text-muted-foreground text-sm mt-1">Generated specifically for your target role.</p>
                                   </div>
                                     <div className="flex gap-2">
                                     <Button 
                                       variant="outline" 
                                       size="icon"
                                       className="hover:bg-muted text-foreground transition-colors" 
                                       title="Print ATS Copy" 
                                       onClick={() => handleDownload('print')}
                                     >
                                       <Printer className="w-4 h-4" />
                                     </Button>
                                     <Button 
                                       onClick={() => handleDownload('pdf')}
                                       disabled={downloading}
                                       className="flex items-center gap-2 border border-primary bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground font-semibold text-sm transition-all shadow-sm"
                                     >
                                       {downloading ? (
                                         <Loader2 className="w-4 h-4 animate-spin" />
                                       ) : (
                                         <Download className="w-4 h-4" /> 
                                       )}
                                       <span>{downloading ? 'Exporting...' : 'PDF'}</span>
                                     </Button>
                                   </div>
                                </div>
                                <div className="bg-card border border-border/50 rounded-lg overflow-hidden mt-4">
                                   <div className="bg-muted/50 px-4 py-2 border-b border-border text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-[#10b981]" /> Professional ATS View
                                   </div>
                                   <div className="p-0 scale-[0.8] md:scale-95 lg:scale-100 origin-top overflow-x-auto custom-scrollbar">
                                      <CoverLetterPreview 
                                        data={result?.cover_letter || result?.recommendation || "Generated cover letter output goes here."} 
                                        className="shadow-xl mx-auto"
                                      />
                                   </div>
                                </div>
                            </>
                        )}

                        {/* FEATURE: Cold Email / DM Generator (Outreach) */}
                        {activeTab.id === 'outreach' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground">Outreach Messages</h3>
                                        <p className="text-muted-foreground text-sm mt-1">Ready to send to Hiring Managers.</p>
                                    </div>
                                    {/* Tone Toggle */}
                                    <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
                                        <button 
                                            onClick={() => setOutreachTone('professional')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${outreachTone === 'professional' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Professional
                                        </button>
                                        <button 
                                            onClick={() => setOutreachTone('creative')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${outreachTone === 'creative' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Creative
                                        </button>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute right-4 top-4 z-10 transition-opacity">
                                        <button 
                                            className="p-2 bg-muted/80 backdrop-blur-sm border border-border rounded-lg hover:bg-muted text-foreground transition-all shadow-sm flex items-center gap-2 text-xs font-semibold" 
                                            onClick={() => navigator.clipboard.writeText(
                                                outreachTone === 'professional' ? (result?.professional_message || '') : (result?.creative_message || '')
                                            )}
                                        >
                                            <Copy className="w-3.5 h-3.5" /> Copy
                                        </button>
                                    </div>
                                    <div className="bg-card border border-border/50 shadow-inner rounded-xl p-8 min-h-[250px] font-medium text-foreground leading-relaxed whitespace-pre-wrap">
                                        {outreachTone === 'professional' 
                                            ? (result?.professional_message || "Generating a professional outreach message...") 
                                            : (result?.creative_message || "Generating a creative outreach message...")}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* General AI Recommendation block for ATS/Job Matching */}
                        {['cv-scoring', 'job-matching'].includes(activeTab.id) && result?.recommendation && (
                            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 mt-2">
                                <h4 className="font-bold mb-2 text-foreground block">AI Strategic Recommendations</h4>
                                <div 
                                    className="prose prose-sm prose-gray dark:prose-invert max-w-none text-muted-foreground" 
                                    dangerouslySetInnerHTML={{ __html: formatMarkdown(result.recommendation) }} 
                                />
                            </div>
                        )}
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center bg-muted/20 p-12">
                <FileText className="w-16 h-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-bold text-card-foreground mb-2">Ready to see the magic?</h3>
                <p className="text-muted-foreground text-center max-w-sm">Select a sample resume or upload your own, and click "Analyze Resume" to see our AI-powered analysis in action.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-10 px-6 mt-20 relative z-10 w-full flex-shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm gap-4">
            <p className="text-muted-foreground font-medium">developed by AADI</p>
            <div className="flex gap-6 text-muted-foreground">
                <button onClick={() => setModalContent('privacy')} className="hover:text-foreground transition-colors outline-none">Privacy Policy</button>
                <button onClick={() => setModalContent('terms')} className="hover:text-foreground transition-colors outline-none">Terms of Service</button>
                <button onClick={() => setModalContent('cookie')} className="hover:text-foreground transition-colors outline-none">Cookie Policy</button>
            </div>
          </div>
      </footer>

      {/* Legal Modals Overlays */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl transition-all animate-in fade-in duration-500">
          <div className="relative mb-10 flex flex-col items-center justify-center">
            {/* Analysis Central Visualizer */}
            <Entropy size={320} color="#191970" className="drop-shadow-[0_0_40px_rgba(25,25,112,0.15)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
          <div className="text-center px-6">
            <h3 className="text-2xl font-display font-bold text-foreground mb-3 uppercase tracking-widest glow-text">Analyzing Profile</h3>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              Bridging Skills & Opportunities
            </div>
          </div>
        </div>
      )}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm shadow-2xl animate-in fade-in duration-200">
           <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden relative shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-xl font-bold text-foreground">
                  {modalContent === 'privacy' && 'Privacy Policy'}
                  {modalContent === 'terms' && 'Terms of Service'}
                  {modalContent === 'cookie' && 'Cookie Policy'}
                </h2>
                <button onClick={() => setModalContent(null)} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 overflow-y-auto text-sm text-muted-foreground space-y-4 custom-scrollbar">
                  <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
                  <p>This is a standard boilerplate text for the <strong>{modalContent}</strong> modal. It sits directly above the core Skillify interface, ensuring users do not lose their current analysis progress.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  <h3 className="font-bold text-foreground pt-4">Data Processing</h3>
                  <p>Your resume data is processed entirely in memory. It is sent directly to the AI Analysis endpoint via the <code>/api/analyze</code> route to extract matching strengths, weaknesses, and ATS formatting markers. It is never permanently stored on our servers.</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
