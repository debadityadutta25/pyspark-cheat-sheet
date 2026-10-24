import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  Table, 
  Code2, 
  ArrowRight, 
  Info,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

interface SimulationOp {
  id: string;
  name: string;
  category: string;
  code: string;
  explanation: string;
  outputHeaders: string[];
  outputRows: (string | number)[][];
}

const SAMPLE_BASE_DATA = {
  headers: ['id', 'name', 'dept', 'salary', 'state'],
  rows: [
    [101, 'Alice Johnson', 'Engineering', 125000, 'CA'],
    [102, 'Bob Smith', 'Marketing', 85000, 'NY'],
    [103, 'Charlie Brown', 'Engineering', 140000, 'CA'],
    [104, 'David Lee', 'HR', 72000, 'TX'],
    [105, 'Eva Martinez', 'Finance', 115000, 'NY'],
    [106, 'Frank White', 'Marketing', 92000, 'IL'],
  ]
};

const SIMULATION_OPS: SimulationOp[] = [
  {
    id: 'filter-high-earners',
    name: 'Filter: salary >= $100k',
    category: 'Filtering',
    code: `df_filtered = df.filter(col("salary") >= 100000)`,
    explanation: 'Scans the dataset and keeps only records satisfying the condition. In Spark, the Catalyst optimizer pushes this filter down directly to the data source (Predicate Pushdown).',
    outputHeaders: ['id', 'name', 'dept', 'salary', 'state'],
    outputRows: [
      [101, 'Alice Johnson', 'Engineering', 125000, 'CA'],
      [103, 'Charlie Brown', 'Engineering', 140000, 'CA'],
      [105, 'Eva Martinez', 'Finance', 115000, 'NY'],
    ]
  },
  {
    id: 'withcolumn-bonus',
    name: 'Add Column: 15% Bonus & Total Comp',
    category: 'Column Manipulation',
    code: `df_bonus = df \\
    .withColumn("bonus", col("salary") * 0.15) \\
    .withColumn("total_comp", col("salary") + col("bonus"))`,
    explanation: 'Creates new columns in parallel across all worker executors. Computed locally without any data shuffle across the network (Narrow Transformation).',
    outputHeaders: ['id', 'name', 'dept', 'salary', 'bonus', 'total_comp'],
    outputRows: [
      [101, 'Alice Johnson', 'Engineering', 125000, 18750, 143750],
      [102, 'Bob Smith', 'Marketing', 85000, 12750, 97750],
      [103, 'Charlie Brown', 'Engineering', 140000, 21000, 161000],
      [104, 'David Lee', 'HR', 72000, 10800, 82800],
      [105, 'Eva Martinez', 'Finance', 115000, 17250, 132250],
      [106, 'Frank White', 'Marketing', 92000, 13800, 105800],
    ]
  },
  {
    id: 'conditional-bands',
    name: 'Conditional: Salary Tier (when/otherwise)',
    category: 'Conditionals',
    code: `df_tiered = df.withColumn(
    "tier",
    when(col("salary") >= 130000, "Senior Leader")
    .when(col("salary") >= 90000, "Senior Professional")
    .otherwise("Professional")
)`,
    explanation: 'Evaluates IF-THEN-ELSE logic sequentially for each row. The Catalyst optimizer compiles this into efficient Java switch/branch instructions.',
    outputHeaders: ['name', 'dept', 'salary', 'tier'],
    outputRows: [
      ['Alice Johnson', 'Engineering', 125000, 'Senior Professional'],
      ['Bob Smith', 'Marketing', 85000, 'Professional'],
      ['Charlie Brown', 'Engineering', 140000, 'Senior Leader'],
      ['David Lee', 'HR', 72000, 'Professional'],
      ['Eva Martinez', 'Finance', 115000, 'Senior Professional'],
      ['Frank White', 'Marketing', 92000, 'Senior Professional'],
    ]
  },
  {
    id: 'groupby-agg',
    name: 'GroupBy: Department Stats (Wide Transformation)',
    category: 'Aggregations',
    code: `df_dept_stats = df.groupBy("dept").agg(
    count("id").alias("headcount"),
    round(avg("salary"), 2).alias("avg_salary"),
    max("salary").alias("max_salary")
)`,
    explanation: 'Wide Transformation: Triggers a cluster network shuffle to group all records with identical department keys into the same partition before aggregating.',
    outputHeaders: ['dept', 'headcount', 'avg_salary', 'max_salary'],
    outputRows: [
      ['Engineering', 2, 132500.00, 140000],
      ['Marketing', 2, 88500.00, 92000],
      ['Finance', 1, 115000.00, 115000],
      ['HR', 1, 72000.00, 72000],
    ]
  },
  {
    id: 'window-ranking',
    name: 'Window: Top Earner per Dept (dense_rank)',
    category: 'Window Analytics',
    code: `windowSpec = Window.partitionBy("dept").orderBy(col("salary").desc())
df_ranked = df.withColumn("dept_rank", dense_rank().over(windowSpec))`,
    explanation: 'Partitions data by department in memory and orders rows by salary to compute intra-group rankings without collapsing rows into an aggregation.',
    outputHeaders: ['name', 'dept', 'salary', 'dept_rank'],
    outputRows: [
      ['Charlie Brown', 'Engineering', 140000, 1],
      ['Alice Johnson', 'Engineering', 125000, 2],
      ['Frank White', 'Marketing', 92000, 1],
      ['Bob Smith', 'Marketing', 85000, 2],
      ['Eva Martinez', 'Finance', 115000, 1],
      ['David Lee', 'HR', 72000, 1],
    ]
  },
  {
    id: 'join-managers',
    name: 'Broadcast Join with Manager Dimension',
    category: 'Joins',
    code: `dept_mgrs = spark.createDataFrame([
    ("Engineering", "Grace Hopper"),
    ("Marketing", "Philip Kotler"),
    ("Finance", "Benjamin Graham")
], ["dept", "director"])

df_joined = df.join(broadcast(dept_mgrs), on="dept", how="left")`,
    explanation: 'Broadcast Join: Sends a copy of the small 3-row director table to all executors in memory, completely eliminating network shuffle for the large employee dataset!',
    outputHeaders: ['dept', 'id', 'name', 'salary', 'director'],
    outputRows: [
      ['Engineering', 101, 'Alice Johnson', 125000, 'Grace Hopper'],
      ['Engineering', 103, 'Charlie Brown', 140000, 'Grace Hopper'],
      ['Marketing', 102, 'Bob Smith', 85000, 'Philip Kotler'],
      ['Marketing', 106, 'Frank White', 92000, 'Philip Kotler'],
      ['Finance', 105, 'Eva Martinez', 115000, 'Benjamin Graham'],
      ['HR', 104, 'David Lee', 72000, 'null'],
    ]
  }
];

export const InteractivePlayground: React.FC = () => {
  const [selectedOp, setSelectedOp] = useState<SimulationOp>(SIMULATION_OPS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive PySpark Execution Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          See Transformations in Action
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Choose a common PySpark operation below to see the exact code, execution mechanics, and resulting DataFrame table update in real time.
        </p>
      </div>

      {/* Operation selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
        {SIMULATION_OPS.map((op) => (
          <button
            key={op.id}
            onClick={() => setSelectedOp(op)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 border ${
              selectedOp.id === op.id
                ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/20 font-semibold'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Play className={`w-3 h-3 ${selectedOp.id === op.id ? 'fill-white text-white' : 'text-zinc-500'}`} />
            <span>{op.name}</span>
          </button>
        ))}
      </div>

      {/* Code & Explanation Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              {selectedOp.category}
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              {selectedOp.name}
            </h3>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs border border-zinc-700 transition self-start sm:self-center"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400 font-medium">Copied Code!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Block */}
        <div className="rounded-xl bg-zinc-950 p-4 font-mono text-xs sm:text-sm text-zinc-200 border border-zinc-800/80 overflow-x-auto shadow-inner">
          <pre>
            <code>{selectedOp.code}</code>
          </pre>
        </div>

        {/* Engine Explanation */}
        <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300">
          <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-orange-400 font-semibold">Behind the Scenes: </strong>
            <span>{selectedOp.explanation}</span>
          </div>
        </div>
      </div>

      {/* Before & After Interactive Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input DataFrame */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <Table className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Source DataFrame (df)
              </h4>
            </div>
            <span className="text-[11px] text-zinc-500">6 rows × 5 cols</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
                <tr>
                  {SAMPLE_BASE_DATA.headers.map((h) => (
                    <th key={h} className="px-3 py-2 font-semibold text-zinc-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 bg-zinc-950/40 text-zinc-300">
                {SAMPLE_BASE_DATA.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition">
                    {row.map((val, cellIdx) => (
                      <td key={cellIdx} className="px-3 py-1.5 whitespace-nowrap">
                        {typeof val === 'number' ? val.toLocaleString() : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Output DataFrame */}
        <div className="rounded-2xl border border-orange-500/30 bg-orange-950/10 p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-orange-500/20">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Resulting DataFrame (df.show())
              </h4>
            </div>
            <span className="text-[11px] text-orange-400/80">
              {selectedOp.outputRows.length} rows × {selectedOp.outputHeaders.length} cols
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-orange-500/20">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950 text-orange-300 border-b border-orange-500/30">
                <tr>
                  {selectedOp.outputHeaders.map((h) => (
                    <th key={h} className="px-3 py-2 font-semibold text-orange-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 bg-zinc-950/70 text-zinc-200">
                {selectedOp.outputRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-orange-500/10 transition">
                    {row.map((val, cellIdx) => (
                      <td key={cellIdx} className="px-3 py-1.5 whitespace-nowrap">
                        {val === 'null' ? (
                          <span className="text-zinc-500 italic">null</span>
                        ) : typeof val === 'number' ? (
                          val.toLocaleString()
                        ) : (
                          String(val)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
