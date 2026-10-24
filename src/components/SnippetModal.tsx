import React from 'react';
import { PySparkSnippet, PYSPARK_CATEGORIES } from '../data/pysparkData';
import { TopicCard } from './TopicCard';
import { X } from 'lucide-react';

interface SnippetModalProps {
  snippet: PySparkSnippet | null;
  onClose: () => void;
}

export const SnippetModal: React.FC<SnippetModalProps> = ({ snippet, onClose }) => {
  if (!snippet) return null;

  // Find category
  const category = PYSPARK_CATEGORIES.find((cat) =>
    cat.snippets.some((s) => s.id === snippet.id)
  ) || PYSPARK_CATEGORIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-1 sm:p-2">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-2">
          <TopicCard snippet={snippet} category={category} />
        </div>
      </div>
    </div>
  );
};
