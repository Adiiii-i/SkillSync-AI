import React, { useState } from 'react';
import ResumePreview from '@/components/ResumePreview';
import { exportToPDF, exportViaPrint, exportToDocx } from '@/utils/pdfExport';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Printer, FileText } from 'lucide-react';

const ResumePage: React.FC = () => {
  const [resumeMarkdown, setResumeMarkdown] = useState<string>(`
# JOHN DOE
New York, NY | (555) 123-4567 | john@email.com

## PROFESSIONAL SUMMARY
Experienced Software Engineer with a focus on building scalable web applications and ATS-optimized hiring tools. Proven track record of improving user engagement and performance across diverse tech stacks.

## PROFESSIONAL EXPERIENCE
### Senior Full-Stack Developer
**TechCorp Solutions** | Jan 2021 — Present
- Architected and deployed a multi-module dashboard resulting in a 30% increase in operational efficiency.
- Led a team of 5 developers to implement secure end-to-end messaging using Web Crypto API.

### Junior Web Developer
**StartUp Hub** | June 2018 — Dec 2020
- Developed responsive front-end components using React and Tailwind CSS for mobile-first accessibility.
- Optimized database queries to reduce page load time by 1.2 seconds across high-traffic landing pages.

## EDUCATION
### B.S. in Computer Science
**State University of New York** | 2014 — 2018

## SKILLS
**Technical:** React, Next.js, TypeScript, Python, Tailwind CSS, PostgreSQL
**Tools:** Docker, Git, AWS, CI/CD, JIRA, Adobe Suite
  `);

  const [downloading, setDownloading] = useState(false);

  const handleExport = async (method: 'pdf' | 'print' | 'docx') => {
    setDownloading(true);
    try {
      if (method === 'pdf') {
        await exportToPDF({
          filename: 'John_Doe_Resume.pdf',
          elementId: 'resume-content',
        });
      } else if (method === 'print') {
        exportViaPrint('resume-content', 'John_Doe_Resume.pdf');
      } else if (method === 'docx') {
        await exportToDocx(resumeMarkdown, 'John_Doe_Resume.docx');
      }
    } catch (err) {
      console.error("Export Error:", err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Resume Preview</h1>
            <p className="text-muted-foreground text-sm">Download your ATS-optimized resume in professional formats.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
                variant="outline" 
                onClick={() => handleExport('print')}
                className="gap-2"
            >
                <Printer className="w-4 h-4" /> Print (Recommended for ATS)
            </Button>
            <Button 
                onClick={() => handleExport('pdf')} 
                disabled={downloading}
                className="gap-2"
            >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export PDF
            </Button>
            <Button 
                variant="secondary"
                onClick={() => handleExport('docx')}
                className="gap-2"
            >
                <FileText className="w-4 h-4" /> Export DOCX
            </Button>
          </div>
        </div>

        {/* ATS Resume Preview */}
        <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-200">
           <ResumePreview data={resumeMarkdown} />
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
