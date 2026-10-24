import React, { useState } from 'react';
import { PYSPARK_CATEGORIES, PySparkCategory, PySparkSnippet } from '../data/pysparkData';
import { Copy, Check, Terminal, ExternalLink, Sparkles } from 'lucide-react';

interface CheatSheetTerminalProps {
  onSelectSnippet: (snippet: PySparkSnippet) => void;
  searchQuery: string;
}

export const CheatSheetTerminal: React.FC<CheatSheetTerminalProps> = ({
  onSelectSnippet,
  searchQuery,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopySnippet = (code: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const allCode = PYSPARK_CATEGORIES.map((cat) => {
      const snippets = cat.snippets.map((s) => s.code).join('\n\n');
      return `# ========================================================\n# ${cat.number}. ${cat.title.toUpperCase()}\n# ========================================================\n${snippets}`;
    }).join('\n\n');

    navigator.clipboard.writeText(allCode);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Syntax highlighting helper for code lines
  const renderHighlightedCode = (line: string) => {
    // Comment line
    if (line.trim().startsWith('#')) {
      return <span className="text-emerald-400/90 font-medium">{line}</span>;
    }

    // Split keywords, strings, function calls
    // A lightweight client-side syntax highlighter
    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:from|import|def|return|if|else|when|otherwise|as|True|False|None)\b|\b(?:col|lit|expr|spark|df|Window|row_number|rank|dense_rank|count|sum|avg|min|max|lead|lag|udf|pandas_udf|broadcast)\b)/g);

    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith('"') || part.startsWith("'")) {
        return <span key={i} className="text-amber-300">{part}</span>;
      }
      if (/^(from|import|def|return|if|else|when|otherwise|as|True|False|None)$/.test(part)) {
        return <span key={i} className="text-purple-400 font-bold">{part}</span>;
      }
      if (/^(col|lit|expr|spark|df|Window|row_number|rank|dense_rank|count|sum|avg|min|max|lead|lag|udf|pandas_udf|broadcast)$/.test(part)) {
        return <span key={i} className="text-cyan-300 font-semibold">{part}</span>;
      }
      if (part.startsWith('.')) {
        return <span key={i} className="text-sky-300">{part}</span>;
      }
      return <span key={i} className="text-zinc-200">{part}</span>;
    });
  };

  const matchesSearch = (cat: PySparkCategory, snippet: PySparkSnippet) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      snippet.title.toLowerCase().includes(q) ||
      snippet.code.toLowerCase().includes(q) ||
      snippet.summary.toLowerCase().includes(q)
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Terminal Container */}
      <div className="rounded-2xl border border-zinc-800 bg-[#141416] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
        
        {/* Terminal Header Bar (macOS Window style matching image) */}
        <div className="bg-[#1c1c1f] px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm"></span>
            <span className="ml-3 text-xs text-zinc-400 font-sans font-medium flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-zinc-500" />
              pyspark_cheat_sheet.py — Apache Spark 3.x Reference
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-sans transition"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-medium">Copied All!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Entire Cheat Sheet</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-2 font-sans text-xs text-orange-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              <strong>Tip:</strong> Click on any code block to view its in-depth breakdown, live input/output DataFrame tables, and SQL comparison!
            </span>
          </div>
          <span className="text-[11px] text-orange-400/80 hidden sm:inline">17 Core PySpark Modules</span>
        </div>

        {/* Code Content Area */}
        <div className="p-4 sm:p-6 overflow-x-auto space-y-8 select-text leading-relaxed">
          
          {/* Top Imports matching user image */}
          <div className="pb-4 border-b border-zinc-800/60">
            <div className="text-emerald-400/90 font-medium mb-1">
              # ========================================================
            </div>
            <div className="text-emerald-400/90 font-bold mb-1">
              # Apache Spark & PySpark Master Reference Cheat Sheet
            </div>
            <div className="text-emerald-400/90 font-medium mb-3">
              # ========================================================
            </div>
            <div className="text-zinc-200 space-y-1">
              <div><span className="text-purple-400 font-bold">from</span> pyspark.sql <span className="text-purple-400 font-bold">import</span> <span className="text-cyan-300 font-semibold">SparkSession</span>, <span className="text-cyan-300 font-semibold">Window</span></div>
              <div><span className="text-purple-400 font-bold">from</span> pyspark.sql.functions <span className="text-purple-400 font-bold">import</span> <span className="text-cyan-300">col</span>, <span className="text-cyan-300">lit</span>, <span className="text-cyan-300">when</span>, <span className="text-cyan-300">expr</span>, <span className="text-cyan-300">count</span>, <span className="text-cyan-300">avg</span>, <span className="text-cyan-300">sum</span>, <span className="text-cyan-300">udf</span>, <span className="text-cyan-300">broadcast</span></div>
              <div><span className="text-purple-400 font-bold">from</span> pyspark.sql.types <span className="text-purple-400 font-bold">import</span> <span className="text-cyan-300">StructType</span>, <span className="text-cyan-300">StructField</span>, <span className="text-cyan-300">StringType</span>, <span className="text-cyan-300">IntegerType</span>, <span className="text-cyan-300">DoubleType</span></div>
            </div>
          </div>

          {/* Iterate over all categories */}
          {PYSPARK_CATEGORIES.map((category) => {
            const visibleSnippets = category.snippets.filter((s) => matchesSearch(category, s));
            if (visibleSnippets.length === 0) return null;

            return (
              <div key={category.id} className="space-y-4">
                {/* Section Header */}
                <div className="pt-2">
                  <div className="text-emerald-400/70 text-xs">
                    # ----------------------------------------------------------------------
                  </div>
                  <div className="flex items-center justify-between text-yellow-400 font-bold text-sm sm:text-base py-0.5">
                    <span># {category.number}. {category.title.toUpperCase()}</span>
                    <span className="text-[11px] font-sans font-normal text-zinc-500 uppercase tracking-wider">
                      {category.description}
                    </span>
                  </div>
                  <div className="text-emerald-400/70 text-xs">
                    # ----------------------------------------------------------------------
                  </div>
                </div>

                {/* Section Snippets */}
                {visibleSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    onClick={() => onSelectSnippet(snippet)}
                    className="group relative bg-[#18181b]/70 hover:bg-[#202024] p-3.5 rounded-xl border border-zinc-800/80 hover:border-orange-500/40 transition-all cursor-pointer"
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/50">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-zinc-300">
                          {snippet.title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-sans font-medium ${
                          snippet.type === 'Transformation'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : snippet.type === 'Action'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {snippet.type}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleCopySnippet(snippet.code, snippet.id, e)}
                          title="Copy snippet"
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                        >
                          {copiedId === snippet.id ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-[11px] font-sans text-orange-400 flex items-center gap-1">
                          Deep Dive <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Code display */}
                    <pre className="text-zinc-200 overflow-x-auto">
                      <code>
                        {snippet.code.split('\n').map((line, index) => (
                          <div key={index} className="table-row">
                            <span className="table-cell select-none pr-4 text-zinc-600 text-right w-8 text-xs">
                              {index + 1}
                            </span>
                            <span className="table-cell">
                              {renderHighlightedCode(line)}
                            </span>
                          </div>
                        ))}
                      </code>
                    </pre>

                    {/* Quick pro-tip snippet if available */}
                    {snippet.proTip && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/40 text-[11px] font-sans text-zinc-400 flex items-start gap-1.5">
                        <span className="text-orange-400 font-semibold">Pro Tip:</span>
                        <span>{snippet.proTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Terminal Footer */}
        <div className="bg-[#1c1c1f] px-4 py-2.5 border-t border-zinc-800/80 text-xs text-zinc-500 font-sans flex items-center justify-between">
          <div>
            <span>PySpark DataFrame API • Catalyst Optimizer • Spark 3.x</span>
          </div>
          <div className="flex items-center space-x-4 text-zinc-400">
            <span>Shift + Click to copy</span>
            <span>Total Sections: 17</span>
          </div>
        </div>
      </div>
    </div>
  );
};
