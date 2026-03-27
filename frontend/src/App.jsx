import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './index.css';
import {
  UploadCloud, Play, BarChart2, Briefcase, FileText,
  DollarSign, Globe, File as FileIcon, CheckCircle2,
  XCircle, AlertCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const formatMarkdown = (text) => {
  if (!text) return '';
  try {
    const rawMarkup = marked(text);
    return DOMPurify.sanitize(rawMarkup);
  } catch (error) {
    console.error("Markdown rendering error:", error);
    return String(text); // Fallback to raw text
  }
};

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', 'General Analysis'); // CV Scoring tool just does general ATS scoring

    try {
      const targetUrl = `${API_URL}/analyze-premium`;
      const response = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze resume. Please ensure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-[#0B1120] text-white py-4 px-6 sticky top-0 z-50 overflow-x-auto w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between min-w-max gap-8 px-4">
          <div className="flex items-center gap-2">
            {/* Logo placeholder */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <div className="w-4 h-4 bg-[#0B1120] rotate-45" />
            </div>
            <span className="font-bold text-xl tracking-tight">cv scoring</span>
          </div>

          <nav className="flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#" className="text-white bg-white/10 px-4 py-2 rounded-full cursor-default">CV Scoring (ATS)</a>
            <a href="#" className="hover:text-white transition-colors">Job Matching Score</a>
            <a href="#" className="hover:text-white transition-colors">Cover Letter Generator</a>
            <a href="#" className="hover:text-white transition-colors">Salary Estimator</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
              <Globe className="w-4 h-4" />
              <span>English</span>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto mt-16 px-6 mb-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">CV Scoring (ATS)</h1>
          <p className="text-gray-500 text-lg md:text-xl">Analyze your resume with AI-powered insights</p>
        </div>

        {/* Feature Stepper */}
        <div className="max-w-4xl mx-auto mb-16 relative">
          <div className="absolute top-6 left-12 right-12 h-[2px] bg-gray-200 -z-10" />
          <div className="flex justify-between relative z-0">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg border-4 border-[#F9FAFB] mb-4">
                <BarChart2 className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm">CV Scoring (ATS)</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[120px] text-center">Analyze your resume with AI-powered insights</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white text-gray-400 border-2 border-gray-200 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-500 text-sm">AI Resume Builder</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[120px] text-center">Create a professional resume with AI</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white text-gray-400 border-2 border-gray-200 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-500 text-sm">Job Matching Score</p>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white text-gray-400 border-2 border-gray-200 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-500 text-sm">Cover Letter Generator</p>
            </div>
            {/* Step 5 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white text-gray-400 border-2 border-gray-200 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-500 text-sm">Salary Estimator</p>
            </div>
          </div>
        </div>

        {/* Dashboard Tools */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[600px]">
          
          {/* Left Column: Upload */}
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-xl font-bold mb-3">Select Resume for Analysis</h2>
            <p className="text-gray-500 text-sm mb-6">Choose a sample resume below and click "CV Scoring (ATS)" to see our AI-powered analysis in action.</p>

            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center mb-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-8 h-8 text-gray-400 mb-4" />
              {file ? (
                <p className="font-medium text-blue-600 truncate w-full text-center px-4">{file.name}</p>
              ) : (
                <>
                  <p className="font-semibold text-gray-800 mb-1">Click to upload your own resume</p>
                  <p className="text-xs text-gray-500">PDF or DOCX (max 5MB)</p>
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

            <div className="my-4 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <span className="relative bg-white px-4 text-xs text-gray-400">or try our sample resumes</span>
            </div>

            {/* Sample Resumes (Non-functional placeholders for UI replication) */}
            <div className="space-y-3 mb-8">
              <div className="border border-gray-200 rounded-lg p-4 flex items-start gap-3 hover:border-blue-400 cursor-pointer transition-colors bg-white">
                <FileIcon className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Isabel Mercado - Marketing Manager</p>
                  <p className="text-xs text-gray-500">Marketing Manager with 5+ years experience</p>
                </div>
              </div>
              <div className="border border-blue-400 bg-blue-50/30 rounded-lg p-4 flex items-start gap-3 cursor-pointer transition-colors">
                <FileIcon className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">John Smith - Software Engineer</p>
                  <p className="text-xs text-gray-500">Senior Software Engineer with 8+ years experience</p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              {error && <p className="text-red-500 text-sm mb-3 font-medium bg-red-50 p-3 rounded-md border border-red-100">{error}</p>}
              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : file ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:opacity-90' : 'bg-[#E2E8F0] text-gray-600 hover:bg-[#CBD5E1]'}`}
              >
                {loading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full" />
                ) : (
                  <Play className={`w-5 h-5 ${file ? 'text-white' : 'text-gray-500'}`} />
                )}
                {loading ? 'Analyzing Profile...' : 'Analyze Resume'}
              </button>
            </div>
          </div>

          {/* Right Column: Preview / Results */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[500px]">
            {loading ? (
              <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50 p-12">
                 <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BarChart2 className="w-8 h-8 text-blue-500 animate-pulse" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing Resume...</h3>
                <p className="text-gray-500 text-center max-w-sm">Our AI is currently benchmarking your resume against millions of data points to generate your ATS score.</p>
              </div>
            ) : result ? (
              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                {/* Results Screen */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b border-gray-100 pb-8">
                            <div className="relative">
                                {/* Score Circular Progress */}
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                                    <circle 
                                        cx="64" 
                                        cy="64" 
                                        r="56" 
                                        stroke="currentColor" 
                                        strokeWidth="12" 
                                        fill="transparent" 
                                        strokeDasharray={2 * Math.PI * 56} 
                                        strokeDashoffset={2 * Math.PI * 56 * (1 - (result?.score || 0) / 100)} 
                                        className={result?.score >= 80 ? 'text-green-500' : result?.score >= 60 ? 'text-amber-500' : 'text-red-500'} 
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black">{result?.score || 0}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ATS Score</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Resume Score Analysis</h3>
                                <p className="text-gray-500 mb-4">{result?.summary}</p>
                                <div className="flex gap-3 flex-wrap">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">Parser Friendly</span>
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">Keyword Optimized</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <h4 className="flex items-center gap-2 font-bold mb-3 text-gray-800">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Strengths
                                </h4>
                                <ul className="space-y-2">
                                    {result?.breakdown?.strengths?.map((str, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">•</span> {str}
                                        </li>
                                    )) || <li className="text-sm text-gray-500 italic">No specific strengths highlighted.</li>}
                                </ul>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <h4 className="flex items-center gap-2 font-bold mb-3 text-gray-800">
                                    <AlertCircle className="w-5 h-5 text-amber-500" /> Areas for Improvement
                                </h4>
                                <ul className="space-y-2">
                                    {result?.breakdown?.weaknesses?.map((weak, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <span className="text-amber-500 mt-0.5">•</span> {weak}
                                        </li>
                                    )) || <li className="text-sm text-gray-500 italic">No specific weaknesses found.</li>}
                                </ul>
                            </div>
                        </div>

                        {result?.recommendation && (
                            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100/50">
                                <h4 className="font-bold mb-2 text-gray-800 block">AI Strategic Recommendations</h4>
                                <div 
                                    className="prose prose-sm max-w-none text-gray-700" 
                                    dangerouslySetInnerHTML={{ __html: formatMarkdown(result.recommendation) }} 
                                />
                            </div>
                        )}
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50 p-12">
                <FileText className="w-16 h-16 text-gray-300 mb-6" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to see the magic?</h3>
                <p className="text-gray-500 text-center max-w-sm">Select a sample resume or upload your own, and click "Analyze Resume" to see our AI-powered analysis in action.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Footer minimal representation */}
      <footer className="bg-[#0B1120] text-gray-400 py-12 px-6 mt-16 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between pt-8 border-t border-gray-800 text-sm">
            <p>© 2026 SkillSync AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0 text-gray-500">
                <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                <a href="#" className="hover:text-gray-300">Terms of Service</a>
                <a href="#" className="hover:text-gray-300">Cookie Policy</a>
            </div>
          </div>
      </footer>
    </div>
  );
}
