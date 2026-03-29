import html2pdf from 'html2pdf.js';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle 
} from 'docx';

/**
 * OPTION 1: exportToPDF() using html2pdf.js
 */
export const exportToPDF = async ({
  filename,
  elementId,
  format = 'letter',
  quality = 2,
}: {
  filename: string;
  elementId: string;
  format?: 'letter' | 'a4';
  quality?: number;
}) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    throw new Error(`Element #${elementId} not found`);
  }

  // Pre-export optimization for ATS
  const opt = {
    margin: [0, 0, 0, 0], // Margins are already handled by internal component padding
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: quality, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'in', format: format, orientation: 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error("PDF Export failed:", err);
    throw err;
  }
};

/**
 * OPTION 2: exportViaPrint() — RECOMMENDED for best ATS text
 */
export const exportViaPrint = (elementId: string, filename: string) => {
  const printContents = document.getElementById(elementId)?.innerHTML;
  if (!printContents) {
    console.error(`Element with id "${elementId}" not found for print export.`);
    return;
  }

  const originalTitle = document.title;
  document.title = filename.replace('.pdf', '');

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Add Necessary Print Styles
  printWindow.document.write(`
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @page { size: letter; margin: 0; }
          body { margin: 0; font-family: "Times New Roman", Times, serif; }
          #print-container { padding: 0.75in; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div id="print-container">
          ${printContents}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  
  // Print and then Restore
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
    document.title = originalTitle;
  }, 250);
};

/**
 * OPTION 3: exportToDocx() — MAXIMUM ATS compatibility
 */
export const exportToDocx = async (content: string, filename: string) => {
  // Simple markdown-to-docx converter for ATS compatibility
  const lines = content.split('\n');
  const sections: any[] = [];

  lines.forEach(line => {
    if (line.startsWith('# ')) {
      // Name / Main Header
      sections.push(new Paragraph({
        text: line.replace('# ', ''),
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }));
    } else if (line.startsWith('## ')) {
      // Section Header (Summary, Experience, etc.)
      sections.push(new Paragraph({
        text: line.replace('## ', ''),
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
        },
      }));
    } else if (line.startsWith('### ')) {
      // Job Title / Degree
      sections.push(new Paragraph({
        children: [
          new TextRun({
            text: line.replace('### ', ''),
            bold: true,
          }),
        ],
      }));
    } else if (line.trim().startsWith('- ')) {
      // Bullet Point
      sections.push(new Paragraph({
        text: line.trim().replace('- ', ''),
        bullet: { level: 0 },
      }));
    } else {
      // Standard Text
      if (line.trim()) {
        sections.push(new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
            }),
          ],
        }));
      }
    }
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 }, // 0.75in in TWIPs
        },
      },
      children: sections,
    }],
  });

  try {
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("DOCX Export failed:", err);
    throw err;
  }
};
