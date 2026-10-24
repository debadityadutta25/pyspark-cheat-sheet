import React, { useState, useMemo } from 'react';
import { PYSPARK_CATEGORIES, PySparkCategory, PySparkSnippet } from './data/pysparkData';
import { Header, ViewMode } from './components/Header';
import { TopicCard } from './components/TopicCard';
import { CheatSheetTerminal } from './components/CheatSheetTerminal';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { InteractivePlayground } from './components/InteractivePlayground';
import { QuizSection } from './components/QuizSection';
import { SnippetModal } from './components/SnippetModal';
import { Footer } from './components/Footer';
import { 
  Flame, 
  Terminal, 
  BookOpen, 
  Sliders, 
  Sparkles, 
  Search, 
  ChevronRight, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [activeCategoryNav, setActiveCategoryNav] = useState<string>('all');
  const [modalSnippet, setModalSnippet] = useState<PySparkSnippet | null>(null);

  // Total snippet count
  const totalSnippets = useMemo(() => {
    return PYSPARK_CATEGORIES.reduce((acc, cat) => acc + cat.snippets.length, 0);
  }, []);

  // Filtered categories & snippets
  const filteredCategories = useMemo(() => {
    return PYSPARK_CATEGORIES.map((cat) => {
      // Filter snippets within this category
      const matchedSnippets = cat.snippets.filter((snippet) => {
        // Search filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matches =
            cat.title.toLowerCase().includes(q) ||
            snippet.title.toLowerCase().includes(q) ||
            snippet.code.toLowerCase().includes(q) ||
            snippet.summary.toLowerCase().includes(q) ||
            (snippet.sqlEquivalent && snippet.sqlEquivalent.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Level filter
        if (selectedLevel !== 'ALL' && snippet.level !== selectedLevel) {
          return false;
        }

        // Type filter
        if (selectedType !== 'ALL' && snippet.type !== selectedType) {
          return false;
        }

        return true;
      });

      return {
        ...cat,
        snippets: matchedSnippets,
      };
    }).filter((cat) => {
      if (activeCategoryNav !== 'all' && cat.id !== activeCategoryNav) {
        return false;
      }
      return cat.snippets.length > 0;
    });
  }, [searchQuery, selectedLevel, selectedType, activeCategoryNav]);

  const filteredCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.snippets.length, 0);
  }, [filteredCategories]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* Top Navigation & Controls */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalSnippets={totalSnippets}
        filteredCount={filteredCount}
      />

      {/* Main View Area */}
      <main className="flex-1">
        
        {/* VIEW 1: INTERACTIVE GUIDE CARDS */}
        {viewMode === 'cards' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Hero Banner */}
            <div className="mb-10 rounded-3xl bg-gradient-to-r from-orange-950/40 via-zinc-900 to-zinc-950 border border-orange-500/20 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="max-w-2xl space-y-3 relative z-10">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/30">
                  <Flame className="w-3.5 h-3.5 animate-bounce" />
                  <span>The Complete PySpark Learning & Reference Hub</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Master Apache Spark with PySpark
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Every essential PySpark command, from DataFrame initialization to Window functions and Catalyst optimization, explained with plain-English insights, output tables, and SQL parallels.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setViewMode('terminal')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs transition shadow-lg shadow-orange-500/20"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>View Image Terminal Cheat Sheet</span>
                  </button>
                  <button
                    onClick={() => setViewMode('playground')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs transition"
                  >
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>Try Interactive Simulator</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Layout: Sticky Category Navigation + Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              
              {/* Category Quick Sidebar */}
              <div className="hidden lg:block sticky top-28 space-y-1.5 p-3 rounded-2xl bg-zinc-950 border border-zinc-900 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                  <span>Categories</span>
                  <span className="text-orange-400">{PYSPARK_CATEGORIES.length}</span>
                </div>

                <button
                  onClick={() => setActiveCategoryNav('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    activeCategoryNav === 'all'
                      ? 'bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <span>All 17 Sections</span>
                  <span className="text-[10px] opacity-80">{totalSnippets}</span>
                </button>

                {PYSPARK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryNav(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                      activeCategoryNav === cat.id
                        ? 'bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <span className="truncate pr-2">
                      {cat.number}. {cat.title}
                    </span>
                    <span className="text-[10px] opacity-75">{cat.snippets.length}</span>
                  </button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="lg:col-span-3 space-y-10">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-2xl border border-zinc-800 bg-zinc-900/40">
                    <Search className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-white mb-1">No matching PySpark guides found</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                      Try searching with different terms like "filter", "withColumn", "groupBy", "join", or "Window".
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedLevel('ALL');
                        setSelectedType('ALL');
                        setActiveCategoryNav('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <section key={category.id} id={category.id} className="space-y-4 scroll-mt-28">
                      {/* Section Title Banner */}
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                        <div className="flex items-center space-x-3">
                          <span className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 font-bold text-xs flex items-center justify-center border border-orange-500/30">
                            {category.number}
                          </span>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                              {category.title}
                            </h3>
                            <p className="text-xs text-zinc-400">
                              {category.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                          {category.snippets.length} operations
                        </span>
                      </div>

                      {/* Snippets list */}
                      <div className="space-y-4">
                        {category.snippets.map((snippet) => (
                          <TopicCard
                            key={snippet.id}
                            snippet={snippet}
                            category={category}
                          />
                        ))}
                      </div>
                    </section>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TERMINAL CHEAT SHEET (MATCHES USER IMAGE) */}
        {viewMode === 'terminal' && (
          <CheatSheetTerminal
            onSelectSnippet={(snippet) => setModalSnippet(snippet)}
            searchQuery={searchQuery}
          />
        )}

        {/* VIEW 3: ARCHITECTURE & INTERNALS */}
        {viewMode === 'architecture' && <ArchitectureGuide />}

        {/* VIEW 4: INTERACTIVE PLAYGROUND */}
        {viewMode === 'playground' && <InteractivePlayground />}

        {/* VIEW 5: PRACTICE QUIZ */}
        {viewMode === 'quiz' && <QuizSection />}
      </main>

      {/* Snippet Details Modal */}
      <SnippetModal
        snippet={modalSnippet}
        onClose={() => setModalSnippet(null)}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
export default App;
