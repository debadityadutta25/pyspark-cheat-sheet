import React from 'react';
import { 
  Flame, 
  Search, 
  Terminal, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  SlidersHorizontal,
  ExternalLink,
  Sparkles,
  Printer,
  Check
} from 'lucide-react';

export type ViewMode = 'cards' | 'terminal' | 'architecture' | 'playground' | 'quiz';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  totalSnippets: number;
  filteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLevel,
  setSelectedLevel,
  selectedType,
  setSelectedType,
  viewMode,
  setViewMode,
  totalSnippets,
  filteredCount,
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      {/* Top Announcements & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                PySpark Mastery
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Cheat Sheet & In-Depth Guide
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400">
              Distributed Data Processing, Catalyst Optimizer & DataFrame API
            </p>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 overflow-x-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'cards'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Guide</span>
          </button>

          <button
            onClick={() => setViewMode('terminal')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'terminal'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal Cheat Sheet</span>
          </button>

          <button
            onClick={() => setViewMode('architecture')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'architecture'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Internals</span>
          </button>

          <button
            onClick={() => setViewMode('playground')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'playground'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Live Playground</span>
          </button>

          <button
            onClick={() => setViewMode('quiz')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'quiz'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Practice Quiz</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            title="Print or Save as PDF"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            <Printer className="w-4 h-4" />
          </button>

          <a
            href="https://github.com/debadityadutta25/datainsight-studio-minimal"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* Search and Filters Bar (Shown in Cards & Terminal View) */}
      {(viewMode === 'cards' || viewMode === 'terminal') && (
        <div className="bg-zinc-950/60 border-t border-zinc-900 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search functions (e.g. withColumn, Window, udf, repartition, na.drop)..."
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Badges */}
            <div className="flex items-center space-x-2 overflow-x-auto text-xs">
              <span className="text-zinc-500 text-[11px] uppercase tracking-wider flex items-center gap-1 font-semibold">
                <SlidersHorizontal className="w-3 h-3" /> Filter:
              </span>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
              >
                <option value="ALL">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
              >
                <option value="ALL">All Operations</option>
                <option value="Transformation">Transformations (Lazy)</option>
                <option value="Action">Actions (Eager)</option>
                <option value="IO">I/O & Formats</option>
                <option value="Config">Configuration</option>
              </select>

              <div className="text-[11px] text-zinc-400 pl-2">
                Showing <strong className="text-orange-400">{filteredCount}</strong> of {totalSnippets} guides
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
