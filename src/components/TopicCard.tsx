import React, { useState } from 'react';
import { PySparkSnippet, PySparkCategory } from '../data/pysparkData';
import { 
  Copy, 
  Check, 
  Database, 
  Lightbulb, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  Table, 
  Binary, 
  Cpu,
  Layers
} from 'lucide-react';

interface TopicCardProps {
  snippet: PySparkSnippet;
  category: PySparkCategory;
}

export const TopicCard: React.FC<TopicCardProps> = ({ snippet, category }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'io' | 'sql' | 'internals'>('code');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Transformation':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Action':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'IO':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Config':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm overflow-hidden hover:border-zinc-700 transition shadow-lg">
      
      {/* Card Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none bg-zinc-900/40 hover:bg-zinc-900/80 transition"
      >
        <div className="flex items-start space-x-3.5">
          <div className="mt-0.5 w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs shrink-0">
            {category.number}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                {snippet.title}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getTypeBadgeColor(snippet.type)}`}>
                {snippet.type} {snippet.type === 'Transformation' ? '(Lazy)' : snippet.type === 'Action' ? '(Eager)' : ''}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getLevelBadgeColor(snippet.level)}`}>
                {snippet.level}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {snippet.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition border border-zinc-700/60"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button className="p-1 rounded text-zinc-400 hover:text-zinc-200">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-zinc-800/80">
          
          {/* Card Sub-Navigation Tabs */}
          <div className="flex items-center bg-zinc-950/70 px-4 sm:px-5 border-b border-zinc-800/60 overflow-x-auto gap-1">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1.5 py-2.5 px-3 text-xs font-medium border-b-2 transition ${
                activeTab === 'code'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>PySpark Code</span>
            </button>

            {(snippet.outputExample || snippet.inputExample) && (
              <button
                onClick={() => setActiveTab('io')}
                className={`flex items-center space-x-1.5 py-2.5 px-3 text-xs font-medium border-b-2 transition ${
                  activeTab === 'io'
                    ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>DataFrame Output</span>
              </button>
            )}

            {snippet.sqlEquivalent && (
              <button
                onClick={() => setActiveTab('sql')}
                className={`flex items-center space-x-1.5 py-2.5 px-3 text-xs font-medium border-b-2 transition ${
                  activeTab === 'sql'
                    ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>SQL Comparison</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('internals')}
              className={`flex items-center space-x-1.5 py-2.5 px-3 text-xs font-medium border-b-2 transition ${
                activeTab === 'internals'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Deep Dive & Pro Tips</span>
            </button>
          </div>

          {/* Tab Panes */}
          <div className="p-4 sm:p-5">
            {/* Tab 1: PySpark Code */}
            {activeTab === 'code' && (
              <div className="space-y-3">
                <div className="relative rounded-xl bg-zinc-950 p-4 font-mono text-xs sm:text-sm text-zinc-200 border border-zinc-800/80 overflow-x-auto shadow-inner">
                  <pre>
                    <code>{snippet.code}</code>
                  </pre>
                </div>

                {snippet.proTip && (
                  <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-400">Catalyst Pro Tip: </strong>
                      <span>{snippet.proTip}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: DataFrame Input / Output Table */}
            {activeTab === 'io' && (
              <div className="space-y-4">
                {snippet.inputExample && (
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block">
                      Sample Input Data:
                    </span>
                    <pre className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto">
                      {snippet.inputExample}
                    </pre>
                  </div>
                )}

                {snippet.outputExample && (
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5" />
                      Resulting PySpark DataFrame (df.show()):
                    </span>
                    <pre className="bg-zinc-950 p-3.5 rounded-xl border border-emerald-500/30 text-xs font-mono text-emerald-300 overflow-x-auto shadow-inner">
                      {snippet.outputExample}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: SQL Equivalent */}
            {activeTab === 'sql' && snippet.sqlEquivalent && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400">
                  How this PySpark transformation translates to standard ANSI / BigQuery SQL:
                </p>
                <div className="rounded-xl bg-zinc-950 p-4 font-mono text-xs text-sky-300 border border-zinc-800 overflow-x-auto">
                  <pre>
                    <code>{snippet.sqlEquivalent}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 4: Deep Dive & Internals */}
            {activeTab === 'internals' && (
              <div className="space-y-4">
                <div className="text-xs text-zinc-300 leading-relaxed space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-1.5">
                    <Binary className="w-3.5 h-3.5 text-orange-400" />
                    How PySpark Executes This Under the Hood:
                  </h4>
                  <p>{snippet.deepDive}</p>
                </div>

                {snippet.commonMistake && (
                  <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-red-400">Common Pitfall: </strong>
                      <span>{snippet.commonMistake}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
