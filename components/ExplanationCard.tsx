import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ExplanationCardProps {
  content: string;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ content }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
      <h3 className="text-xl font-bold text-vue-green mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Migration Summary
      </h3>
      <div className="prose prose-invert prose-sm max-w-none text-slate-300">
        <ReactMarkdown
          components={{
            strong: ({node, ...props}) => <span className="font-bold text-vue-green" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2" {...props} />,
            li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
            code: ({node, ...props}) => <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono text-xs" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ExplanationCard;
