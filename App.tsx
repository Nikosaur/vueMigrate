import React, { useState } from 'react';
import { migrateVueCode } from './services/geminiService';
import { MigrationStatus } from './types';
import CodeEditor from './components/CodeEditor';
import ExplanationCard from './components/ExplanationCard';

// Default example to help users get started
const DEFAULT_INPUT = `<template>
  <div class="counter">
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  props: {
    initialValue: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      count: this.initialValue
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
      this.$emit('update', this.count)
    }
  },
  mounted() {
    console.log('Counter mounted!')
  }
}
</script>`;

const App: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>(DEFAULT_INPUT);
  const [outputCode, setOutputCode] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [status, setStatus] = useState<MigrationStatus>(MigrationStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleMigrate = async () => {
    if (!inputCode.trim()) return;

    setStatus(MigrationStatus.LOADING);
    setErrorMessage('');
    setOutputCode('');
    setExplanation('');

    try {
      const result = await migrateVueCode(inputCode);
      setOutputCode(result.migratedCode);
      setExplanation(result.explanation);
      setStatus(MigrationStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to migrate code. Please check your internet connection or API key and try again.");
      setStatus(MigrationStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-vue-green to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-vue-green/20">
              V
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Vue 2 to 3 Migrator</h1>
              <p className="text-xs text-slate-400">Options API (JS) → Composition API (TS)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hidden sm:inline-block">
               Gemini 3 Pro
             </span>
             <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Documentation</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Error Banner */}
        {status === MigrationStatus.ERROR && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </div>
        )}

        {/* Editor Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px] lg:h-[700px]">
          {/* Input */}
          <div className="flex flex-col gap-2 h-full">
            <CodeEditor 
              label="Vue 2 (JavaScript - Options API)"
              value={inputCode}
              onChange={setInputCode}
              placeholder="// Paste your Vue 2 component here..."
            />
          </div>

          {/* Action Button (Mobile) */}
          <div className="lg:hidden flex justify-center">
             <button
              onClick={handleMigrate}
              disabled={status === MigrationStatus.LOADING || !inputCode.trim()}
              className={`
                w-full py-3 px-6 rounded-lg font-bold text-white shadow-lg transition-all transform active:scale-95
                ${status === MigrationStatus.LOADING 
                  ? 'bg-slate-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-vue-green to-emerald-600 hover:shadow-vue-green/30'
                }
              `}
            >
              {status === MigrationStatus.LOADING ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Migrating...
                </span>
              ) : (
                'Migrate to Vue 3 →'
              )}
            </button>
          </div>

          {/* Output */}
          <div className="flex flex-col gap-2 h-full relative">
            {/* Desktop Action Button - Absolute Centered between cols if we wanted, but let's keep it simple or sticky */}
            
            <CodeEditor 
              label="Vue 3 (TypeScript - Composition API)"
              value={outputCode}
              readOnly={true}
              placeholder="// Migrated code will appear here..."
            />

            {/* Overlay for Loading State */}
            {status === MigrationStatus.LOADING && (
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-10 border border-slate-700">
                 <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-slate-600 border-t-vue-green rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-xs font-mono text-vue-green">TS</span>
                      </div>
                    </div>
                    <p className="text-slate-300 animate-pulse">Analyzing component structure...</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Main Action Button */}
        <div className="hidden lg:flex justify-center -mt-2">
             <button
              onClick={handleMigrate}
              disabled={status === MigrationStatus.LOADING || !inputCode.trim()}
              className={`
                py-3 px-10 rounded-full font-bold text-white shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-95
                ${status === MigrationStatus.LOADING 
                  ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-vue-green to-emerald-600 hover:shadow-vue-green/40 ring-1 ring-white/10'
                }
              `}
            >
              {status === MigrationStatus.LOADING ? 'Translating Logic...' : '✨ Migrate Component'}
            </button>
        </div>

        {/* Explanation Section */}
        {explanation && status === MigrationStatus.SUCCESS && (
          <div className="animate-fade-in-up">
            <ExplanationCard content={explanation} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800">
        <p>Powered by Google Gemini 3 Pro • Built with React & Tailwind</p>
      </footer>
    </div>
  );
};

export default App;
