import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * COVERLETTERDATA INTERFACE
 */
export interface CoverLetterData {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  date: string;
  recipientName: string;
  recipientTitle: string;
  company: string;
  companyAddress: string;
  body: string; 
  closing: string;
}

interface CoverLetterPreviewProps {
  data: string | CoverLetterData;
  className?: string;
}

/**
 * Traditional Business Letter Format Cover Letter Preview Component
 */
const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ data, className = "" }) => {
  const styles = {
    container: {
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '11pt',
      lineHeight: '1.5', // More relaxed spacing for letters
      color: '#000',
      backgroundColor: '#fff',
      padding: '1in',
      width: '8.5in',
      minHeight: '11in',
      margin: '0 auto',
      boxSizing: 'border-box' as const,
      textAlign: 'left' as const,
    },
    section: {
      marginBottom: '1.5rem',
    },
    senderInfo: {
      marginBottom: '1rem',
    },
    recipientInfo: {
      marginBottom: '1.5rem',
    },
    body: {
      whiteSpace: 'pre-wrap' as const,
    },
    closing: {
      marginTop: '2rem',
    },
    signature: {
      marginTop: '3.5rem',
      fontWeight: 'bold',
    }
  };

  const isStringData = typeof data === 'string';

  const renderStructuredData = (cl: CoverLetterData) => {
    return (
      <>
        {/* SENDER INFO */}
        <div style={styles.senderInfo}>
          <div><strong>{cl.senderName}</strong></div>
          <div>{cl.senderAddress}</div>
          <div>{cl.senderEmail} | {cl.senderPhone}</div>
        </div>

        {/* DATE */}
        <div style={styles.section}>{cl.date}</div>

        {/* RECIPIENT INFO */}
        <div style={styles.recipientInfo}>
          <div>{cl.recipientName}</div>
          <div>{cl.recipientTitle}</div>
          <div>{cl.company}</div>
          <div>{cl.companyAddress}</div>
        </div>

        {/* SALUTATION */}
        <div style={styles.section}>Dear {cl.recipientName},</div>

        {/* BODY */}
        <div style={styles.body}>{cl.body}</div>

        {/* CLOSING */}
        <div style={styles.closing}>
          <div>{cl.closing}</div>
          <div style={styles.signature}>{cl.senderName}</div>
        </div>
      </>
    );
  };

  return (
    <div 
      id="cover-letter-content" 
      className={className}
      style={styles.container}
    >
      {isStringData ? (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              // Ensure formatting matches the letter style
              p: ({ node, ...props }) => <p style={{ marginBottom: '1rem' }} {...props} />,
              ul: ({ node, ...props }) => <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
              li: ({ node, ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
            }}
          >
            {data as string}
          </ReactMarkdown>
        </div>
      ) : (
        renderStructuredData(data as CoverLetterData)
      )}
    </div>
  );
};

export default CoverLetterPreview;
