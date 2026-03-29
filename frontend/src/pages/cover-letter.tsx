import React, { useState } from 'react';
import CoverLetterPreview, { CoverLetterData } from '@/components/CoverLetterPreview';
import { exportToPDF, exportViaPrint } from '@/utils/pdfExport';
import { Button } from '@/components/ui/button';
import { Download, Printer, Loader2 } from 'lucide-react';

const CoverLetterPage: React.FC = () => {
  const [clData, setClData] = useState<CoverLetterData>({
    senderName: "John Doe",
    senderEmail: "john@email.com",
    senderPhone: "(555) 123-4567",
    senderAddress: "New York, NY",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    recipientName: "Hiring Manager",
    recipientTitle: "Principal Engineer",
    company: "TechCorp Solutions",
    companyAddress: "San Francisco, CA",
    body: `I am writing to express my strong interest in the Senior Full-Stack Developer position at TechCorp Solutions. With over 6 years of experience in the tech industry and a deep focus on building scalable web applications, I am confident that my skills and passion for high-performance software will make me a valuable addition to your team.

At my previous company, TechCorp Solutions, I led a major architectural overhaul that improved operational efficiency by 30%. I have a proven track record of delivering secure, high-quality code across distributed systems. I am particularly excited about your current focus on AI-driven analytics, an area where my background in data modeling and performance optimization can provide immediate value.

I look forward to discussing how my experience with React, Next.js, and TypeScript can help TechCorp Solutions achieve its growth goals and maintain its position as a market leader in innovative solutions.`,
    closing: "Sincerely,"
  });

  const [downloading, setDownloading] = useState(false);

  const handleExport = async (method: 'pdf' | 'print') => {
    setDownloading(true);
    try {
      if (method === 'pdf') {
        await exportToPDF({
          filename: 'John_Doe_Cover_Letter.pdf',
          elementId: 'cover-letter-content',
        });
      } else if (method === 'print') {
        exportViaPrint('cover-letter-content', 'John_Doe_Cover_Letter.pdf');
      }
    } catch (err) {
      console.error("Export Error:", err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cover Letter Preview</h1>
            <p className="text-muted-foreground text-sm">Download your professional business letter for job applications.</p>
          </div>
          <div className="flex gap-2">
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
          </div>
        </div>

        {/* ATS Cover Letter Preview */}
        <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-200">
           <CoverLetterPreview data={clData} />
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPage;
