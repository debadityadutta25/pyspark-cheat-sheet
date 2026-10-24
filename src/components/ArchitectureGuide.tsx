import React, { useState } from 'react';
import { SPARK_CORE_CONCEPTS, SparkConcept } from '../data/pysparkData';
import { 
  Cpu, 
  Workflow, 
  Layers, 
  Zap, 
  GitBranch, 
  Network, 
  ArrowRight, 
  Server, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<number>(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Intro Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Apache Spark Internals & Engine Mechanics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          How PySpark Works Under the Hood
        </h2>
        <p className="text-sm text-zinc-400">
          Understand the Catalyst Optimizer, Tungsten execution engine, DAG scheduling, and distributed memory management to write blazingly fast data pipelines.
        </p>
      </div>

      {/* Visual Diagram 1: Cluster Architecture */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Network className="w-5 h-5 text-orange-400" />
          1. Distributed Master-Worker Architecture
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          How the Driver Program coordinates parallel tasks across Executor JVMs in a cluster.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Driver Node */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Master Process</span>
                <Server className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Driver Program</h4>
              <p className="text-xs text-zinc-300 mb-4">
                Runs your Python script, initializes <code className="text-blue-300">SparkSession</code>, constructs the logical DAG, and breaks queries into Stages and Tasks.
              </p>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>Translates code to Spark DAG</li>
                <li>Schedules tasks across cluster</li>
                <li>Monitors job progress & Web UI</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-500/20 text-[11px] text-blue-300">
              ⚠️ Never call <code className="bg-blue-900/50 px-1 py-0.5 rounded">.collect()</code> on big datasets here!
            </div>
          </div>

          {/* Cluster Manager */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Resource Negotiator</span>
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Cluster Manager</h4>
              <p className="text-xs text-zinc-300 mb-4">
                Acquires compute containers and allocates CPU/memory resources based on cluster load.
              </p>
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/50">
                  <span className="font-semibold text-zinc-300">Kubernetes (K8s)</span>
                  <span className="text-[10px] text-zinc-500">Cloud-Native</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/50">
                  <span className="font-semibold text-zinc-300">Hadoop YARN</span>
                  <span className="text-[10px] text-zinc-500">Enterprise</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/50">
                  <span className="font-semibold text-zinc-300">Standalone / Local</span>
                  <span className="text-[10px] text-zinc-500">Dev & Testing</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] text-amber-300">
              Allocates worker nodes dynamically.
            </div>
          </div>

          {/* Worker Executors */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Compute Workers</span>
                <Workflow className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Worker Executors</h4>
              <p className="text-xs text-zinc-300 mb-4">
                Dedicated JVM processes running on worker machines. They execute parallel tasks and store partitions in RAM.
              </p>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>Execute computation tasks</li>
                <li>Store cached data in memory & disk</li>
                <li>Shuffle data partitions across network</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-300">
              Each executor can run multiple concurrent task threads.
            </div>
          </div>
        </div>
      </div>

      {/* Visual Diagram 2: Catalyst Optimizer Pipeline */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Workflow className="w-5 h-5 text-orange-400" />
          2. The Catalyst Optimizer & Tungsten Engine Pipeline
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          Every DataFrame and SQL query passes through 4 optimization phases before generating high-performance Java bytecode.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 relative">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider mb-2 inline-block">
              Stage 1
            </span>
            <h4 className="text-sm font-semibold text-white mb-1">Analysis</h4>
            <p className="text-xs text-zinc-400">
              Catalyst checks relations, table names, and column types against the Catalog schema to resolve unresolved attributes.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 relative">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider mb-2 inline-block">
              Stage 2
            </span>
            <h4 className="text-sm font-semibold text-white mb-1">Logical Optimization</h4>
            <p className="text-xs text-zinc-400">
              Applies rule-based optimizations: predicate pushdown (filters early), projection pruning (drops unused cols), and constant folding.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 relative">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider mb-2 inline-block">
              Stage 3
            </span>
            <h4 className="text-sm font-semibold text-white mb-1">Physical Planning</h4>
            <p className="text-xs text-zinc-400">
              Generates multiple physical execution strategies and uses Cost-Based Optimization (CBO) to choose the best algorithm (e.g. BroadcastHashJoin vs SortMergeJoin).
            </p>
          </div>

          <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 relative">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider mb-2 inline-block">
              Stage 4
            </span>
            <h4 className="text-sm font-semibold text-white mb-1">Tungsten CodeGen</h4>
            <p className="text-xs text-zinc-400">
              Whole-Stage Code Generation: Compiles the entire pipeline directly into compact Java bytecode, executing within CPU cache and off-heap binary memory.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Diagram 3: Narrow vs Wide Transformations */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-orange-400" />
          3. Narrow vs. Wide Transformations (The Network Shuffle)
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          Why understanding Shuffles is the #1 skill for writing high-performance Spark code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Narrow */}
          <div className="rounded-xl bg-zinc-950 p-5 border border-emerald-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-base font-bold text-emerald-400">Narrow Dependency (No Shuffle)</h4>
            </div>
            <p className="text-xs text-zinc-300 mb-3">
              Each input partition is processed by exactly ONE output partition. Data remains inside executor RAM without traveling over the network.
            </p>
            <div className="bg-zinc-900 p-3 rounded-lg font-mono text-xs text-zinc-300 space-y-1 mb-3">
              <div>• <span className="text-emerald-400">df.select()</span></div>
              <div>• <span className="text-emerald-400">df.filter() / df.where()</span></div>
              <div>• <span className="text-emerald-400">df.withColumn()</span></div>
              <div>• <span className="text-emerald-400">df.drop()</span></div>
              <div>• <span className="text-emerald-400">df.coalesce()</span> (decreasing)</div>
            </div>
            <span className="text-[11px] text-emerald-300 font-medium">⚡ Speed: Blazingly fast, pipelineable in CPU registers.</span>
          </div>

          {/* Wide */}
          <div className="rounded-xl bg-zinc-950 p-5 border border-rose-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <h4 className="text-base font-bold text-rose-400">Wide Dependency (Requires Shuffle)</h4>
            </div>
            <p className="text-xs text-zinc-300 mb-3">
              Multiple input partitions contribute to an output partition. Spark must hash, serialize, write to disk, and transfer data across the network.
            </p>
            <div className="bg-zinc-900 p-3 rounded-lg font-mono text-xs text-zinc-300 space-y-1 mb-3">
              <div>• <span className="text-rose-400">df.groupBy().agg()</span></div>
              <div>• <span className="text-rose-400">df.join()</span> (SortMergeJoin)</div>
              <div>• <span className="text-rose-400">df.distinct()</span></div>
              <div>• <span className="text-rose-400">df.repartition()</span></div>
              <div>• <span className="text-rose-400">Window.partitionBy()</span></div>
            </div>
            <span className="text-[11px] text-rose-300 font-medium">🐢 Cost: Disk I/O + network serialization + stage boundary.</span>
          </div>
        </div>
      </div>

      {/* Interactive Core Concepts Tabs */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-4">
          Core Spark Concepts Explanations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Concept Navigation */}
          <div className="space-y-2">
            {SPARK_CORE_CONCEPTS.map((concept, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedConcept(idx)}
                className={`w-full text-left p-3 rounded-xl text-xs font-medium transition ${
                  selectedConcept === idx
                    ? 'bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <div className="text-[10px] opacity-80 uppercase tracking-wider mb-0.5">{concept.category}</div>
                <div>{concept.title}</div>
              </button>
            ))}
          </div>

          {/* Concept Content Detail */}
          <div className="md:col-span-3 bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
                {SPARK_CORE_CONCEPTS[selectedConcept].category}
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                {SPARK_CORE_CONCEPTS[selectedConcept].title}
              </h4>
              <p className="text-xs text-zinc-400">
                {SPARK_CORE_CONCEPTS[selectedConcept].subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3.5 rounded-lg border border-zinc-800/80">
              {SPARK_CORE_CONCEPTS[selectedConcept].summary}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-200">Key Takeaways:</span>
              <ul className="space-y-2">
                {SPARK_CORE_CONCEPTS[selectedConcept].bullets.map((bullet, i) => (
                  <li key={i} className="text-xs text-zinc-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
