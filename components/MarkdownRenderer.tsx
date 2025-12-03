import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * A simple renderer to handle basic markdown syntax commonly returned by LLMs.
 * Supports: bold (**), headers (###), bullet points (- ), and newlines.
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const lines = content.split('\n');

  return (
    <div className={`space-y-2 ${className}`}>
      {lines.map((line, index) => {
        // Headers (e.g., ### Title)
        if (line.startsWith('###')) {
          return <h3 key={index} className="text-lg font-bold text-emerald-800 mt-4 mb-2">{line.replace(/^###\s+/, '')}</h3>;
        }
        if (line.startsWith('##')) {
          return <h2 key={index} className="text-xl font-bold text-emerald-900 mt-5 mb-2">{line.replace(/^##\s+/, '')}</h2>;
        }
        if (line.startsWith('#')) {
          return <h1 key={index} className="text-2xl font-bold text-emerald-900 mt-6 mb-3">{line.replace(/^#\s+/, '')}</h1>;
        }

        // List items (e.g., - Item or * Item)
        if (line.match(/^[\*\-]\s/)) {
          const text = line.replace(/^[\*\-]\s+/, '');
          return (
            <div key={index} className="flex items-start ml-2">
              <span className="mr-2 text-emerald-500">•</span>
              <p className="text-stone-700 leading-relaxed">
                {parseBold(text)}
              </p>
            </div>
          );
        }

        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-2"></div>;
        }

        // Regular paragraphs
        return (
          <p key={index} className="text-stone-700 leading-relaxed">
            {parseBold(line)}
          </p>
        );
      })}
    </div>
  );
};

// Helper to parse **bold** text
const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-stone-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default MarkdownRenderer;
