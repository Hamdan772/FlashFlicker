'use client';

import { ReactNode } from 'react';

interface MarkdownFormatterProps {
  content: string;
  className?: string;
}

export function MarkdownFormatter({ content, className = '' }: MarkdownFormatterProps) {
  // Enhanced formatting for AI responses
  const formatContent = (text: string): ReactNode => {
    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n+/);
    
    return paragraphs.map((paragraph, index) => {
      // Handle different types of content
      if (paragraph.trim() === '') return null;
      
      // Check for headers (lines starting with #)
      if (paragraph.startsWith('#')) {
        const headerLevel = paragraph.match(/^#+/)?.[0].length || 1;
        const headerText = paragraph.replace(/^#+\s*/, '');
        
        const HeaderTag = `h${Math.min(headerLevel, 6)}` as keyof JSX.IntrinsicElements;
        return (
          <HeaderTag 
            key={index} 
            className={`font-semibold text-primary ${
              headerLevel === 1 ? 'text-xl mb-3 mt-4 pb-2 border-b border-gray-200 dark:border-gray-700' :
              headerLevel === 2 ? 'text-lg mb-2 mt-3 text-primary' :
              'text-md mb-2 mt-2'
            }`}
          >
            {headerText}
          </HeaderTag>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\.\s/.test(paragraph)) {
        const listItems = paragraph.split(/\n(?=\d+\.\s)/);
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-4 ml-4 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed text-gray-800 dark:text-gray-200">
                {formatInlineContent(item.replace(/^\d+\.\s*/, ''))}
              </li>
            ))}
          </ol>
        );
      }
      
      // Handle bullet points
      if (/^[-*•]\s/.test(paragraph)) {
        const listItems = paragraph.split(/\n(?=[-*•]\s)/);
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4 ml-4 bg-gray-50 dark:bg-gray-900/30 p-3 rounded-md">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed text-gray-800 dark:text-gray-200">
                {formatInlineContent(item.replace(/^[-*•]\s*/, ''))}
              </li>
            ))}
          </ul>
        );
      }
      
      // Handle code blocks (triple backticks)
      if (paragraph.includes('```')) {
        const parts = paragraph.split(/(```[\s\S]*?```)/);
        return (
          <div key={index} className="mb-4">
            {parts.map((part, partIndex) => {
              if (part.startsWith('```') && part.endsWith('```')) {
                const code = part.slice(3, -3).trim();
                return (
                  <pre key={partIndex} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto my-2">
                    <code className="text-sm font-mono">{code}</code>
                  </pre>
                );
              }
              return formatInlineContent(part);
            })}
          </div>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="mb-3 leading-relaxed">
          {formatInlineContent(paragraph)}
        </p>
      );
    }).filter(Boolean);
  };
  
  // Format inline content (bold, italic, code, etc.)
  const formatInlineContent = (text: string): ReactNode => {
    if (!text) return null;
    
    // Split by various inline formatting patterns
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|__[^_]+__|_[^_]+_)/);
    
    return parts.map((part, index) => {
      // Bold text (**text** or __text__)
      if ((part.startsWith('**') && part.endsWith('**')) || 
          (part.startsWith('__') && part.endsWith('__'))) {
        const content = part.slice(2, -2);
        return <strong key={index} className="font-semibold text-primary">{content}</strong>;
      }
      
      // Italic text (*text* or _text_)
      if ((part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) ||
          (part.startsWith('_') && part.endsWith('_') && !part.startsWith('__'))) {
        const content = part.slice(1, -1);
        return <em key={index} className="italic text-blue-600 dark:text-blue-400">{content}</em>;
      }
      
      // Inline code (`text`)
      if (part.startsWith('`') && part.endsWith('`')) {
        const content = part.slice(1, -1);
        return (
          <code key={index} className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded text-sm font-mono border">
            {content}
          </code>
        );
      }
      
      // Regular text with line breaks
      return part.split('\n').map((line, lineIndex, lines) => (
        <span key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ));
    });
  };

  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      {formatContent(content)}
    </div>
  );
}