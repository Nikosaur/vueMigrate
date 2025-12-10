import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label: string;
  placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  readOnly = false, 
  label, 
  placeholder 
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-300 font-mono tracking-wide">{label}</span>
        {readOnly && value && (
          <button 
            onClick={() => navigator.clipboard.writeText(value)}
            className="text-xs text-vue-green hover:text-white transition-colors"
          >
            Copy
          </button>
        )}
      </div>
      <div className="relative flex-1">
        <textarea
          className={`w-full h-full p-4 bg-slate-950 font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-1 focus:ring-vue-green/50 ${
            readOnly ? 'text-slate-300 cursor-text' : 'text-slate-100'
          }`}
          spellCheck={false}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
