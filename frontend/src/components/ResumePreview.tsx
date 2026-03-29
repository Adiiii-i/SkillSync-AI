import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * PROPS INTERFACE
 */
export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    dates: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    dates: string;
  }>;
  skills: {
    [category: string]: string[];
  };
}

interface ResumePreviewProps {
  data: string | ResumeData;
  className?: string;
}

/**
 * Harvard Business School Format Resume Preview Component
 */
const ResumePreview: React.FC<ResumePreviewProps> = ({ data, className = "" }) => {
  // Styles based on HBS Format requirements
  const styles = {
    container: {
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '11pt',
      lineHeight: '1.15',
      color: '#000',
      backgroundColor: '#fff',
      padding: '0.75in',
      width: '8.5in',
      minHeight: '11in',
      margin: '0 auto',
      boxSizing: 'border-box' as const,
      textAlign: 'left' as const,
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '15pt',
    },
    name: {
      fontSize: '18pt',
      fontWeight: 'bold',
      textTransform: 'uppercase' as const,
      margin: '0 0 4pt 0',
    },
    contact: {
      fontSize: '10pt',
      margin: '0',
    },
    sectionHeader: {
      fontSize: '11pt',
      fontWeight: 'bold',
      textTransform: 'uppercase' as const,
      borderBottom: '1px solid #000',
      marginTop: '12pt',
      marginBottom: '6pt',
      paddingBottom: '1pt',
    },
    entryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 'bold',
      marginBottom: '0',
    },
    entrySubHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontStyle: 'italic',
      marginBottom: '2pt',
    },
    list: {
      margin: '2pt 0 6pt 1.25rem',
      padding: '0',
      listStyleType: 'disc',
    },
    listItem: {
      marginBottom: '2pt',
    },
    skillRow: {
      marginBottom: '4pt',
    }
  };

  const isStringData = typeof data === 'string';

  const renderStructuredData = (resume: ResumeData) => {
    return (
      <>
        {/* PERSONAL INFO */}
        <header style={styles.header}>
          <h1 style={styles.name}>{resume.personalInfo.name}</h1>
          <p style={styles.contact}>
            {resume.personalInfo.location} | {resume.personalInfo.phone} | {resume.personalInfo.email}
          </p>
        </header>

        {/* PROFESSIONAL SUMMARY */}
        {resume.summary && (
          <section>
            <h2 style={styles.sectionHeader}>Professional Summary</h2>
            <p style={{ margin: '0 0 10pt 0' }}>{resume.summary}</p>
          </section>
        )}

        {/* PROFESSIONAL EXPERIENCE */}
        <section>
          <h2 style={styles.sectionHeader}>Professional Experience</h2>
          {resume.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '8pt' }}>
              <div style={styles.entryHeader}>
                <span>{exp.title}</span>
                <span>{exp.dates}</span>
              </div>
              <div style={styles.entrySubHeader}>
                <span>{exp.company}</span>
              </div>
              <ul style={styles.list}>
                {exp.achievements.map((ach, aIndex) => (
                  <li key={aIndex} style={styles.listItem}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* EDUCATION */}
        <section>
          <h2 style={styles.sectionHeader}>Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '6pt' }}>
              <div style={styles.entryHeader}>
                <span>{edu.school}</span>
                <span>{edu.dates}</span>
              </div>
              <div style={styles.entrySubHeader}>
                <span>{edu.degree}</span>
              </div>
            </div>
          ))}
        </section>

        {/* SKILLS */}
        <section>
          <h2 style={styles.sectionHeader}>Skills</h2>
          {Object.entries(resume.skills).map(([category, skillList], index) => (
            <div key={index} style={styles.skillRow}>
              <strong>{category}: </strong>
              <span>{skillList.join(', ')}</span>
            </div>
          ))}
        </section>
      </>
    );
  };

  return (
    <div 
      id="resume-content" 
      className={className}
      style={styles.container}
    >
      {isStringData ? (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 style={styles.name} {...props} />,
              h2: ({ node, ...props }) => <h2 style={styles.sectionHeader} {...props} />,
              h3: ({ node, ...props }) => <h3 style={{ fontSize: '11pt', fontWeight: 'bold', margin: '8pt 0 0 0' }} {...props} />,
              p: ({ node, ...props }) => <p style={{ margin: '4pt 0' }} {...props} />,
              ul: ({ node, ...props }) => <ul style={styles.list} {...props} />,
              li: ({ node, ...props }) => <li style={styles.listItem} {...props} />,
              strong: ({ node, ...props }) => <strong style={{ fontWeight: 'bold' }} {...props} />,
              em: ({ node, ...props }) => <em style={{ fontStyle: 'italic' }} {...props} />,
            }}
          >
            {data as string}
          </ReactMarkdown>
        </div>
      ) : (
        renderStructuredData(data as ResumeData)
      )}
    </div>
  );
};

export default ResumePreview;
