import React, { useState } from 'react';
import { Sprout, MessageCircle, ScanLine } from 'lucide-react';
import { AppMode } from './types';
import PlantAnalyzer from './components/PlantAnalyzer';
import ChatInterface from './components/ChatInterface';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.IDENTIFY);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-stone-200 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-green-700 hidden sm:block">
                Botanica AI
              </span>
            </div>

            <div className="flex gap-1 bg-stone-100/50 p-1 rounded-xl">
              <button
                onClick={() => setMode(AppMode.IDENTIFY)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === AppMode.IDENTIFY
                    ? 'bg-white text-emerald-700 shadow-sm shadow-stone-200 ring-1 ring-stone-200'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
                }`}
              >
                <ScanLine className="w-4 h-4" />
                Identify
              </button>
              <button
                onClick={() => setMode(AppMode.CHAT)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === AppMode.CHAT
                    ? 'bg-white text-emerald-700 shadow-sm shadow-stone-200 ring-1 ring-stone-200'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Assistant
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {mode === AppMode.IDENTIFY ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3 tracking-tight">
                  Discover Your Garden
                </h1>
                <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                  Snap a photo of any plant to identify it instantly and receive personalized care instructions.
                </p>
              </div>
              <PlantAnalyzer />
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3 tracking-tight">
                  Ask the Expert
                </h1>
                <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                  Have questions about pruning, pests, or planting seasons? Chat with our AI botanist.
                </p>
              </div>
              <ChatInterface />
            </div>
          )}
        </div>
      </main>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-100/30 rounded-full blur-3xl opacity-60"></div>
      </div>
    </div>
  );
}

export default App;
