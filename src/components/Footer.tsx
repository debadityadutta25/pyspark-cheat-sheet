import React from 'react';
import { Flame, ExternalLink, BookOpen, Terminal, Sparkles, Heart, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 mt-16 text-xs text-zinc-500 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <span className="font-bold text-sm text-white">PySpark Mastery & Cheat Sheet</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              An open-source interactive learning guide and reference hub based on the essential PySpark cheat sheet. Designed to help data engineers and scientists master distributed computing with Apache Spark 3.x.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h5 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px]">Official Resources</h5>
            <ul className="space-y-1.5 text-zinc-400">
              <li>
                <a
                  href="https://spark.apache.org/docs/latest/api/python/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-400 transition flex items-center gap-1"
                >
                  <span>PySpark API Docs</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://spark.apache.org/docs/latest/sql-programming-guide.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-400 transition flex items-center gap-1"
                >
                  <span>Spark SQL Guide</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://spark.apache.org/docs/latest/cluster-overview.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-400 transition flex items-center gap-1"
                >
                  <span>Cluster Architecture</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* GitHub & Hosting */}
          <div className="space-y-2">
            <h5 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px]">Open Source & Hosting</h5>
            <ul className="space-y-1.5 text-zinc-400">
              <li>
                <a
                  href="https://github.com/debadityadutta25/pyspark-cheat-sheet"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-400 transition flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <span className="text-zinc-500">Hosted via GitHub Pages</span>
              </li>
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-orange-400 transition"
                >
                  ↑ Back to top
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            Built with React, TypeScript & Tailwind CSS • Apache Spark™ is a trademark of The Apache Software Foundation.
          </div>
          <div className="flex items-center space-x-1">
            <span>Crafted for high-performance distributed data engineering</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
