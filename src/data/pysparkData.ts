export interface PySparkSnippet {
  id: string;
  title: string;
  code: string;
  type: 'Transformation' | 'Action' | 'Config' | 'Schema' | 'IO';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  deepDive?: string;
  inputExample?: string;
  outputExample?: string;
  sqlEquivalent?: string;
  proTip?: string;
  commonMistake?: string;
}

export interface PySparkCategory {
  id: string;
  number: number;
  title: string;
  description: string;
  iconName: string;
  snippets: PySparkSnippet[];
}

export const PYSPARK_CATEGORIES: PySparkCategory[] = [
  {
    id: 'init',
    number: 1,
    title: 'Initializing Spark Session',
    description: 'The universal entry point to programming Spark with the Dataset and DataFrame API.',
    iconName: 'PlayCircle',
    snippets: [
      {
        id: 'init-builder',
        title: 'Create or Retrieve a SparkSession',
        code: `from pyspark.sql import SparkSession

# Initialize SparkSession (the unified entry point in Spark 2.x/3.x)
spark = SparkSession.builder \\
    .appName("PySparkMastery") \\
    .master("local[*]") \\
    .config("spark.sql.shuffle.partitions", "4") \\
    .config("spark.driver.memory", "2g") \\
    .getOrCreate()`,
        type: 'Config',
        level: 'Beginner',
        summary: 'Builds a SparkSession or connects to an existing active session across cluster or local threads.',
        deepDive: 'Prior to Spark 2.0, applications required separate SparkContext (RDDs), SQLContext (SQL), and HiveContext (Hive). SparkSession consolidates all of them into a single singleton builder. `master("local[*]")` tells Spark to run locally using all available CPU cores.',
        sqlEquivalent: '-- No direct SQL equivalent; this initializes the distributed SQL query engine.',
        proTip: 'In local development, always set `spark.sql.shuffle.partitions` to a small number (e.g. 2 to 8). The default is 200, which creates 200 tiny partitions for every join/groupBy, causing massive scheduling overhead on small datasets!',
        commonMistake: 'Calling `SparkSession.builder...` multiple times in notebooks without `.getOrCreate()`, or forgetting that master should usually be omitted when deploying to cluster managers like YARN or Kubernetes.'
      },
      {
        id: 'init-context',
        title: 'Access Underlying SparkContext & Configurations',
        code: `# Access the underlying SparkContext for low-level RDD operations
sc = spark.sparkContext

# Check active application ID and Spark version
print(f"Spark Version: {spark.version}")
print(f"App ID: {sc.applicationId}")
print(f"Default Parallelism: {sc.defaultParallelism}")`,
        type: 'Config',
        level: 'Intermediate',
        summary: 'Inspect runtime configuration, default parallelism, and access low-level SparkContext properties.',
        deepDive: '`sc.defaultParallelism` is determined by the cluster manager (e.g., number of available cores in local mode, or total executor cores on a cluster). It dictates the partition count for operations like `parallelize()`.',
        proTip: 'Open the Spark UI in your browser at http://localhost:4040 to monitor active DAGs, stages, memory execution, and query plans in real time.'
      }
    ]
  },
  {
    id: 'read-create',
    number: 2,
    title: 'Creating & Reading DataFrames',
    description: 'Loading structured and semi-structured datasets from files, distributed storage, or memory.',
    iconName: 'Database',
    snippets: [
      {
        id: 'read-csv',
        title: 'Read CSV File with Inferred or Explicit Schema',
        code: `# Read CSV with header and automatic type inference
df_csv = spark.read.csv(
    "data/employees.csv",
    header=True,
    inferSchema=True
)

# Alternative syntax using format()
df_csv = spark.read.format("csv") \\
    .option("header", "true") \\
    .option("inferSchema", "true") \\
    .option("nullValue", "NA") \\
    .load("data/employees.csv")`,
        type: 'IO',
        level: 'Beginner',
        summary: 'Reads tabular delimited data into a distributed DataFrame.',
        deepDive: 'When `inferSchema=True` is enabled, Spark must make an extra full pass through the CSV file to determine data types. On multi-gigabyte or terabyte datasets, this doubles read time.',
        inputExample: `id,name,department,salary
101,Alice Johnson,Engineering,95000
102,Bob Smith,Marketing,62000
103,Charlie Brown,Engineering,105000`,
        outputExample: `+---+-------------+-----------+------+
| id|         name| department|salary|
+---+-------------+-----------+------+
|101|Alice Johnson|Engineering| 95000|
|102|    Bob Smith|  Marketing| 62000|
|103|Charlie Brown|Engineering|105000|
+---+-------------+-----------+------+`,
        proTip: 'For production pipelines, always define an explicit StructType schema instead of inferSchema=True. It guarantees schema stability and skips the initial dataset pre-scan.',
        commonMistake: 'Forgetting header=True, which treats the first row of column names as regular data strings.'
      },
      {
        id: 'read-parquet-json',
        title: 'Read Parquet & JSON Datasets',
        code: `# Parquet is the industry standard columnar storage for Spark
df_parquet = spark.read.parquet("data/transactions.parquet")

# Read JSON records (single-line or multiLine)
df_json = spark.read.json("data/events.json")

# For multi-line JSON objects:
df_multi_json = spark.read.option("multiline", "true").json("data/complex.json")`,
        type: 'IO',
        level: 'Beginner',
        summary: 'Loads high-efficiency Parquet columnar files and schema-less JSON files.',
        deepDive: 'Parquet preserves schema metadata, data types, and column statistics (min/max) inside the file footer. This enables Spark Catalyst to perform "predicate pushdown" (skipping entire row chunks that do not match filters) without reading the entire dataset!',
        proTip: 'Always choose Parquet or Delta Lake over CSV in production. Parquet offers 5x-10x compression and up to 20x faster query execution through column pruning and vectorization.'
      },
      {
        id: 'create-dataframe-schema',
        title: 'Create DataFrame from Python List with StructType Schema',
        code: `from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType

# Sample Python data tuples
data = [
    (1, "Alice", "Engineering", 120000.0),
    (2, "Bob", "Marketing", 85000.0),
    (3, "Cathy", "Engineering", 140000.0),
    (4, "David", "HR", 75000.0),
    (5, "Eva", "Finance", 110000.0)
]

# Explicit schema definition
schema = StructType([
    StructField("id", IntegerType(), nullable=False),
    StructField("name", StringType(), nullable=True),
    StructField("dept", StringType(), nullable=True),
    StructField("salary", DoubleType(), nullable=True)
])

df = spark.createDataFrame(data=data, schema=schema)`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Constructs a distributed DataFrame in-memory from Python sequences with strict typing.',
        deepDive: 'When creating DataFrames locally, Spark parallelizes the collection into partitions across worker nodes. Specifying `nullable=False` helps the Catalyst optimizer optimize join and aggregation plans.',
        outputExample: `+---+-----+-----------+--------+
| id| name|       dept|  salary|
+---+-----+-----------+--------+
|  1|Alice|Engineering|120000.0|
|  2|  Bob|  Marketing| 85000.0|
|  3|Cathy|Engineering|140000.0|
|  4|David|         HR| 75000.0|
|  5|  Eva|    Finance|110000.0|
+---+-----+-----------+--------+`
      }
    ]
  },
  {
    id: 'inspect',
    number: 3,
    title: 'Inspecting & Viewing Data',
    description: 'Quickly previewing rows, printing tree schemas, counting records, and computing statistical profiles.',
    iconName: 'Eye',
    snippets: [
      {
        id: 'inspect-preview',
        title: 'Preview Rows with show() & printSchema()',
        code: `# Display first 20 rows (truncated by default)
df.show()

# Display 5 rows without truncating long text strings
df.show(5, truncate=False)

# Display tree representation of columns and data types
df.printSchema()

# Inspect column names and (col, type) tuples
print(df.columns)
print(df.dtypes)`,
        type: 'Action',
        level: 'Beginner',
        summary: 'Renders the DataFrame table and outputs the hierarchical schema structure to console.',
        deepDive: '`df.show()` is an **Action** that collects only the first n rows back to the driver and formats them as an ASCII table. `df.printSchema()` only inspects the existing catalog metadata without triggering a cluster job.',
        outputExample: `root
 |-- id: integer (nullable = false)
 |-- name: string (nullable = true)
 |-- dept: string (nullable = true)
 |-- salary: double (nullable = true)`
      },
      {
        id: 'inspect-stats',
        title: 'Count, Head, Take, & Summary Statistics',
        code: `# Total count of rows (Action - scans dataset)
total_rows = df.count()

# Count of distinct rows
unique_rows = df.distinct().count()

# Compute summary statistics (mean, stddev, min, max, count)
df.describe().show()

# Compute detailed statistical percentiles (25%, 50%, 75%)
df.summary("count", "mean", "stddev", "min", "25%", "50%", "75%", "max").show()

# Return rows to driver as Python Row objects
first_row = df.first()
top_3_rows = df.take(3)
first_5_rows = df.head(5)`,
        type: 'Action',
        level: 'Beginner',
        summary: 'Calculates summary metrics and pulls sample rows into Python runtime.',
        deepDive: '`df.take(n)` and `df.head(n)` only evaluate the first partition(s) needed to satisfy n rows. Never call `df.collect()` on big data — `collect()` pulls the ENTIRE distributed dataset into driver RAM, frequently causing `OutOfMemoryError: Java heap space`.',
        proTip: 'Use `df.limit(10).toPandas()` when working in Jupyter Notebooks to get a beautiful HTML rendered table without risking Driver OOM.'
      }
    ]
  },
  {
    id: 'select-filter',
    number: 4,
    title: 'Selecting & Filtering Columns',
    description: 'Projecting specific fields, computing expressions, and filtering rows with boolean conditions.',
    iconName: 'Filter',
    snippets: [
      {
        id: 'select-cols',
        title: 'Select Columns and Calculated Expressions',
        code: `from pyspark.sql.functions import col, expr

# Select by column string names
df.select("name", "dept").show(3)

# Select using col() objects with arithmetic expressions and aliases
df.select(
    col("name"),
    col("dept"),
    (col("salary") * 1.10).alias("projected_salary")
).show(3)

# Select using SQL string expression via expr()
df.select(
    col("name"),
    expr("salary * 1.10 AS salary_with_bonus")
).show(3)`,
        type: 'Transformation',
        level: 'Beginner',
        summary: 'Projects column subsets and evaluates row-level transformations.',
        deepDive: 'Selecting with `col("name")` enables object-oriented manipulation, type checks, and complex nested expressions compared to plain string identifiers.',
        sqlEquivalent: 'SELECT name, dept, salary * 1.10 AS projected_salary FROM employees;',
        outputExample: `+-----+-----------+----------------+
| name|       dept|projected_salary|
+-----+-----------+----------------+
|Alice|Engineering|        132000.0|
|  Bob|  Marketing|         93500.0|
|Cathy|Engineering|        154000.0|
+-----+-----------+----------------+`
      },
      {
        id: 'filter-where',
        title: 'Filter & Where with Compound Conditions',
        code: `from pyspark.sql.functions import col

# Filter rows where salary is greater than 100,000
df.filter(col("salary") > 100000).show()

# where() is an exact alias for filter()
df.where(col("dept") == "Engineering").show()

# Compound conditions: MUST wrap each condition in () and use &, |, ~
df.filter(
    (col("dept") == "Engineering") & (col("salary") >= 120000)
).show()

# OR condition
df.filter((col("dept") == "HR") | (col("salary") > 130000)).show()

# NOT condition with tilde (~)
df.filter(~(col("dept") == "Marketing")).show()`,
        type: 'Transformation',
        level: 'Beginner',
        summary: 'Filters DataFrame rows based on SQL-like boolean expressions.',
        deepDive: 'In Python, the logical operators `and`, `or`, `not` cannot be overloaded for objects. Therefore, PySpark overloads bitwise operators `&` (AND), `|` (OR), and `~` (NOT). Because bitwise operators have higher operator precedence than comparison operators, parentheses around every single condition are MANDATORY.',
        sqlEquivalent: `SELECT * FROM employees 
WHERE dept = 'Engineering' AND salary >= 120000;`,
        commonMistake: 'Writing `df.filter(col("dept") == "Engineering" & col("salary") > 100000)`. This causes a TypeError because & executes before ==!'
      },
      {
        id: 'filter-strings',
        title: 'String Pattern Matching: isin, like, startswith, contains',
        code: `from pyspark.sql.functions import col

# Value list membership (IN)
df.filter(col("dept").isin(["Engineering", "Finance"])).show()

# Prefix & suffix checks
df.filter(col("name").startswith("A")).show()
df.filter(col("name").endswith("e")).show()

# Substring containment
df.filter(col("name").contains("li")).show()

# SQL LIKE and regex RLIKE
df.filter(col("name").like("%ic%")).show()
df.filter(col("name").rlike("^[A-C].*")).show()`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Matches string attributes using set containment, wildcard LIKE, and regular expressions.',
        sqlEquivalent: `SELECT * FROM employees 
WHERE dept IN ('Engineering', 'Finance') AND name LIKE '%ic%';`
      }
    ]
  },
  {
    id: 'columns',
    number: 5,
    title: 'Adding, Renaming, Casting & Dropping Columns',
    description: 'Transforming DataFrame schemas, creating computed columns, casting data types, and pruning unused fields.',
    iconName: 'Columns3',
    snippets: [
      {
        id: 'col-withcolumn',
        title: 'Add & Modify Columns with withColumn()',
        code: `from pyspark.sql.functions import col, lit

# Add a computed column (bonus = 15% of salary)
df_bonus = df.withColumn("bonus", col("salary") * 0.15)

# Add a literal constant value using lit()
df_status = df.withColumn("status", lit("ACTIVE"))

# Overwrite an existing column by providing the same name
df_updated = df.withColumn("salary", col("salary") + 5000)

# Chain multiple column additions
df_full = df \\
    .withColumn("bonus", col("salary") * 0.15) \\
    .withColumn("total_comp", col("salary") + col("bonus")) \\
    .withColumn("tier", lit("Tier-1"))`,
        type: 'Transformation',
        level: 'Beginner',
        summary: 'Generates new columns or overwrites existing ones using column expressions.',
        deepDive: 'DataFrames in Spark are immutable. `withColumn` does not modify the original DataFrame; it returns a new DataFrame with the updated execution plan. Note: Adding hundreds of `withColumn` calls in a loop causes Catalyst query plan recursion depth issues; use `.select()` with a list comprehension for bulk column creation.',
        proTip: 'Whenever you want to assign a raw constant value (like string "ACTIVE" or number 100), you MUST wrap it in `lit("ACTIVE")`. Passing a raw Python string directly will fail because Spark expects a Column object.'
      },
      {
        id: 'col-rename-drop-cast',
        title: 'Rename, Drop, and Cast Columns',
        code: `from pyspark.sql.functions import col
from pyspark.sql.types import IntegerType, DoubleType

# Rename a single column
df_renamed = df.withColumnRenamed("dept", "department")

# Rename multiple columns simultaneously using toDF(*names)
df_all_renamed = df.toDF("emp_id", "emp_name", "department", "base_salary")

# Drop single or multiple columns
df_dropped = df.drop("salary")
df_pruned = df.drop("dept", "salary")

# Cast column data type using string shorthand or DataType instance
df_cast = df.withColumn("id", col("id").cast("string")) \\
            .withColumn("salary", col("salary").cast(IntegerType()))`,
        type: 'Transformation',
        level: 'Beginner',
        summary: 'Manipulates schema metadata by changing field names, casting types, and deleting unwanted columns.',
        sqlEquivalent: `SELECT id::string AS id, name, dept AS department, CAST(salary AS INT) AS salary 
FROM employees;`
      }
    ]
  },
  {
    id: 'conditional',
    number: 6,
    title: 'Conditional Logic (when / otherwise)',
    description: 'Implementing IF-THEN-ELSE branch evaluations across distributed columns.',
    iconName: 'GitBranch',
    snippets: [
      {
        id: 'cond-when',
        title: 'Multi-Condition Branching with when() & otherwise()',
        code: `from pyspark.sql.functions import col, when

# Categorize employees into salary bands
df_bands = df.withColumn(
    "salary_bracket",
    when(col("salary") >= 130000, "High")
    .when((col("salary") >= 90000) & (col("salary") < 130000), "Medium")
    .otherwise("Standard")
)

df_bands.select("name", "salary", "salary_bracket").show()`,
        type: 'Transformation',
        level: 'Beginner',
        summary: 'Evaluates conditional branches sequentially, returning the value of the first matching predicate.',
        deepDive: '`when()` is PySpark\'s implementation of SQL\'s `CASE WHEN ... THEN ... ELSE ... END`. You can chain as many `.when()` calls as needed. If `.otherwise()` is omitted, unmatched rows evaluate to `null`.',
        sqlEquivalent: `SELECT name, salary,
  CASE 
    WHEN salary >= 130000 THEN 'High'
    WHEN salary >= 90000 THEN 'Medium'
    ELSE 'Standard'
  END AS salary_bracket
FROM employees;`,
        outputExample: `+-----+--------+--------------+
| name|  salary|salary_bracket|
+-----+--------+--------------+
|Alice|120000.0|        Medium|
|  Bob| 85000.0|      Standard|
|Cathy|140000.0|          High|
|David| 75000.0|      Standard|
|  Eva|110000.0|        Medium|
+-----+--------+--------------+`
      },
      {
        id: 'cond-expr',
        title: 'Inline SQL CASE WHEN with expr()',
        code: `from pyspark.sql.functions import expr

# Use raw SQL syntax inside expr() for readable conditional expressions
df_fast = df.withColumn(
    "bonus_percentage",
    expr("""
        CASE 
            WHEN dept = 'Engineering' THEN 0.20
            WHEN dept = 'Finance' THEN 0.15
            ELSE 0.10
        END
    """)
)

df_fast.select("name", "dept", "bonus_percentage").show()`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Leverages Catalyst SQL parser directly to express multi-branch logic cleanly.',
        proTip: '`expr()` compiles into the exact same Catalyst physical plan as `when()/otherwise()`, with zero performance difference. Use whichever syntax your team finds more readable.'
      }
    ]
  },
  {
    id: 'group-agg',
    number: 7,
    title: 'Grouping & Aggregations',
    description: 'Summarizing data across categories with sum, avg, count, min, max, pivot, and custom metrics.',
    iconName: 'BarChart2',
    snippets: [
      {
        id: 'group-basic',
        title: 'Basic GroupBy & Quick Aggregations',
        code: `# Quick row count by department
df.groupBy("dept").count().show()

# Quick calculation across all numerical columns
df.groupBy("dept").avg("salary").show()
df.groupBy("dept").min("salary").show()
df.groupBy("dept").max("salary").show()
df.groupBy("dept").sum("salary").show()`,
        type: 'Transformation',
        level: 'Beginner',
        summary: 'Groups rows sharing the same key and computes standard mathematical metrics.',
        sqlEquivalent: `SELECT dept, COUNT(*), AVG(salary), MIN(salary), MAX(salary) 
FROM employees GROUP BY dept;`,
        outputExample: `+-----------+--------+
|       dept|count(1)|
+-----------+--------+
|Engineering|       2|
|  Marketing|       1|
|         HR|       1|
|    Finance|       1|
+-----------+--------+`
      },
      {
        id: 'group-agg-multi',
        title: 'Multi-Metric Aggregations with agg()',
        code: `from pyspark.sql.functions import count, avg, min, max, sum, countDistinct, round

# Compute comprehensive departmental summary
dept_summary = df.groupBy("dept").agg(
    count("id").alias("headcount"),
    round(avg("salary"), 2).alias("avg_salary"),
    min("salary").alias("min_salary"),
    max("salary").alias("max_salary"),
    sum("salary").alias("total_payroll"),
    countDistinct("id").alias("unique_employees")
)

dept_summary.show()`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Executes multiple simultaneous aggregate functions with custom aliases and rounding.',
        deepDive: '`groupBy()` triggers a **Wide Transformation** (Shuffle). Spark maps rows with identical keys across cluster nodes to the same reducer partition. This is often the most resource-intensive phase of a job.',
        outputExample: `+-----------+---------+----------+----------+----------+-------------+
|       dept|headcount|avg_salary|min_salary|max_salary|total_payroll|
+-----------+---------+----------+----------+----------+-------------+
|Engineering|        2|  130000.0|  120000.0|  140000.0|     260000.0|
|  Marketing|        1|   85000.0|   85000.0|   85000.0|      85000.0|
|         HR|        1|   75000.0|   75000.0|   75000.0|      75000.0|
|    Finance|        1|  110000.0|  110000.0|  110000.0|     110000.0|
+-----------+---------+----------+----------+----------+-------------+`
      },
      {
        id: 'group-pivot',
        title: 'Pivot Tables & Multi-Dimensional Grouping',
        code: `# Pivot transposes unique values from a column into separate new columns
# df.groupBy("year").pivot("quarter").sum("revenue").show()

# Providing explicit pivot values prevents an extra scan to discover categories
quarters = ["Q1", "Q2", "Q3", "Q4"]
# df.groupBy("year").pivot("quarter", quarters).sum("revenue").show()`,
        type: 'Transformation',
        level: 'Advanced',
        summary: 'Rotates categorical column values into distinct columns for cross-tabulation.',
        proTip: 'Always pass the explicit list of distinct pivot values as the second argument: `pivot("quarter", ["Q1", "Q2", "Q3", "Q4"])`. Otherwise, Spark runs an eager job just to discover all unique column values!'
      }
    ]
  },
  {
    id: 'sorting',
    number: 8,
    title: 'Sorting & Ordering',
    description: 'Arranging rows globally across partitions or locally within individual partitions.',
    iconName: 'ArrowUpDown',
    snippets: [
      {
        id: 'sort-basic',
        title: 'Global Sorting with sort() & orderBy()',
        code: `from pyspark.sql.functions import col

# Sort ascending by salary (default)
df.sort("salary").show()

# Sort descending using col().desc()
df.sort(col("salary").desc()).show()

# Multi-column sort: Department ascending, then salary descending
df.orderBy(col("dept").asc(), col("salary").desc()).show()

# Explicit control over NULL placement (nulls_first / nulls_last)
df.sort(col("salary").desc_nulls_last()).show()`,
        type: 'Transformation',
        level: 'Beginner',
        summary: 'Sorts the entire distributed dataset across all cluster partitions.',
        deepDive: '`orderBy()` and `sort()` perform a total global sort. This requires a RangePartitioner shuffle across all executors. In Spark, `sort()` and `orderBy()` are 100% synonymous.',
        sqlEquivalent: `SELECT * FROM employees 
ORDER BY dept ASC, salary DESC NULLS LAST;`
      },
      {
        id: 'sort-partitions',
        title: 'High-Performance Local Sorting with sortWithinPartitions()',
        code: `# Sorts data within each partition independently without network shuffle!
df_local_sorted = df.sortWithinPartitions("salary")`,
        type: 'Transformation',
        level: 'Advanced',
        summary: 'Sorts rows locally inside existing partitions without moving data across network wires.',
        proTip: 'When writing partitioned files (e.g. `df.write.partitionBy("dept").parquet(...)`), calling `sortWithinPartitions("id")` immediately before writing dramatically speeds up compression and avoids expensive global shuffles!'
      }
    ]
  },
  {
    id: 'nulls',
    number: 9,
    title: 'Handling Missing & Null Values',
    description: 'Detecting, dropping, filling, and imputing null, NaN, and placeholder values.',
    iconName: 'AlertTriangle',
    snippets: [
      {
        id: 'null-drop',
        title: 'Drop Rows with Missing Values via na.drop()',
        code: `# Drop row if ANY column contains null
df_clean = df.na.drop()
df_clean = df.na.drop(how="any")

# Drop row ONLY if ALL columns are null
df_clean = df.na.drop(how="all")

# Drop row only if specific critical columns contain null
df_clean = df.na.drop(subset=["name", "salary"])`,
        type: 'Transformation',
        level: 'Beginner',
        summary: 'Removes records containing null values with granular column targeting.',
        sqlEquivalent: 'SELECT * FROM employees WHERE name IS NOT NULL AND salary IS NOT NULL;'
      },
      {
        id: 'null-fill-replace',
        title: 'Fill & Replace Nulls with na.fill() & coalesce()',
        code: `from pyspark.sql.functions import col, coalesce, lit

# Fill all numerical nulls with 0
df_filled = df.na.fill(0)

# Fill all string nulls with "Unknown"
df_filled = df.na.fill("Unknown")

# Column-specific default value dictionary (Best Practice)
df_custom = df.na.fill({
    "salary": 50000.0,
    "dept": "Unassigned",
    "name": "Anonymous"
})

# Replace specific sentinel values (e.g. "N/A" -> "Unknown")
df_replaced = df.na.replace(["N/A", "MISSING"], ["Unknown", "Unknown"], subset=["dept"])

# coalesce(): Return the first non-null expression from left to right
df_coalesced = df.withColumn(
    "effective_dept",
    coalesce(col("dept"), lit("General"))
)`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Replaces null values with defaults or chooses the first available non-null field.',
        sqlEquivalent: `SELECT name, COALESCE(dept, 'General') AS effective_dept 
FROM employees;`
      },
      {
        id: 'null-count',
        title: 'Count Nulls Across Every Column',
        code: `from pyspark.sql.functions import count, when, col

# One-liner to audit null counts across the entire schema
null_counts = df.select([
    count(when(col(c).isNull(), c)).alias(c) 
    for c in df.columns
])

null_counts.show()`,
        type: 'Action',
        level: 'Intermediate',
        summary: 'Generates a data hygiene report displaying null occurrences per column.',
        outputExample: `+---+----+----+------+
| id|name|dept|salary|
+---+----+----+------+
|  0|   0|   0|     0|
+---+----+----+------+`
      }
    ]
  },
  {
    id: 'joins',
    number: 10,
    title: 'Joins & Broadcast Optimization',
    description: 'Combining datasets using inner, left, right, outer, semi, anti joins, and broadcast caching.',
    iconName: 'GitMerge',
    snippets: [
      {
        id: 'join-types',
        title: 'Standard DataFrame Joins (Inner, Left, Full, Anti, Semi)',
        code: `# Sample department manager DataFrame
dept_data = [("Engineering", "Grace"), ("Marketing", "Hannah"), ("Design", "Ian")]
dept_df = spark.createDataFrame(dept_data, ["dept", "manager"])

# 1. Inner Join (only rows with matching keys in both)
inner_df = df.join(dept_df, on="dept", how="inner")

# 2. Left Outer Join (all left rows, filled with null on right if no match)
left_df = df.join(dept_df, on="dept", how="left")

# 3. Left Semi Join (Filter left rows where key exists on right; right cols not returned)
semi_df = df.join(dept_df, on="dept", how="left_semi")

# 4. Left Anti Join (Filter left rows where key DOES NOT exist on right - NOT IN)
anti_df = df.join(dept_df, on="dept", how="left_anti")

# 5. Full Outer Join (all rows from both sides)
full_df = df.join(dept_df, on="dept", how="outer")`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Merges two distributed DataFrames based on joining keys.',
        deepDive: 'Notice the syntax `on="dept"`. When you pass a string column name rather than `df1.dept == df2.dept`, Spark preserves exactly ONE copy of the join key column in the output schema! If you join on `df1.dept == df2.dept`, you will get duplicate columns that cause ambiguous reference errors downstream.',
        sqlEquivalent: `SELECT e.*, d.manager 
FROM employees e 
LEFT JOIN departments d ON e.dept = d.dept;`
      },
      {
        id: 'join-broadcast',
        title: 'Broadcast Join Optimization (Zero Shuffle)',
        code: `from pyspark.sql.functions import broadcast

# Tell Spark to broadcast the small dimension table to every executor
# This converts an expensive Sort-Merge Shuffle Join into a lightning-fast Map-Side Join!
optimized_df = df.join(broadcast(dept_df), on="dept", how="left")

optimized_df.show()`,
        type: 'Transformation',
        level: 'Advanced',
        summary: 'Replicates small lookup tables across all executors to completely eliminate network shuffles.',
        deepDive: 'In a standard Sort-Merge Join, Spark hashes and ships millions of rows across nodes over the network. When one table is small (default < 10MB, controlled by `spark.sql.autoBroadcastJoinThreshold`), `broadcast(small_df)` copies the small table into the memory of every worker executor. Each worker can then perform joins locally in RAM without any data shuffle!',
        proTip: 'Never broadcast a large table (> 100MB-500MB). It will exhaust Driver RAM during collect and crash the application with OutOfMemoryError.'
      }
    ]
  },
  {
    id: 'windows',
    number: 11,
    title: 'Window Functions',
    description: 'Calculating ranking, moving averages, cumulative sums, and lead/lag over partitioned subsets.',
    iconName: 'Sliders',
    snippets: [
      {
        id: 'win-ranks',
        title: 'Ranking Functions: row_number, rank, dense_rank',
        code: `from pyspark.sql.window import Window
from pyspark.sql.functions import col, row_number, rank, dense_rank

# Define window specification: Partition by department, ordered by salary desc
dept_window = Window.partitionBy("dept").orderBy(col("salary").desc())

# Apply window ranking functions
df_ranked = df \\
    .withColumn("row_num", row_number().over(dept_window)) \\
    .withColumn("rank", rank().over(dept_window)) \\
    .withColumn("dense_rank", dense_rank().over(dept_window))

# Get the highest paid employee per department (Top 1 per group)
top_earners = df_ranked.filter(col("dense_rank") == 1)`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Calculates sequential row indexes, rankings with gaps, and consecutive dense ranks.',
        deepDive: 'Difference between ranks on tied salaries (e.g., 100k, 100k, 90k):\\n- `row_number()`: 1, 2, 3 (arbitrary tie-breaker)\\n- `rank()`: 1, 1, 3 (leaves a gap)\\n- `dense_rank()`: 1, 1, 2 (no gaps, consecutive numbers).',
        sqlEquivalent: `SELECT *, 
  ROW_NUMBER() OVER(PARTITION BY dept ORDER BY salary DESC) as row_num,
  RANK() OVER(PARTITION BY dept ORDER BY salary DESC) as rank,
  DENSE_RANK() OVER(PARTITION BY dept ORDER BY salary DESC) as dense_rank
FROM employees;`,
        outputExample: `+---+-----+-----------+--------+-------+----+----------+
| id| name|       dept|  salary|row_num|rank|dense_rank|
+---+-----+-----------+--------+-------+----+----------+
|  3|Cathy|Engineering|140000.0|      1|   1|         1|
|  1|Alice|Engineering|120000.0|      2|   2|         2|
|  5|  Eva|    Finance|110000.0|      1|   1|         1|
|  2|  Bob|  Marketing| 85000.0|      1|   1|         1|
|  4|David|         HR| 75000.0|      1|   1|         1|
+---+-----+-----------+--------+-------+----+----------+`
      },
      {
        id: 'win-lead-lag-cumulative',
        title: 'Lead, Lag & Running Total (Custom Window Frames)',
        code: `from pyspark.sql.window import Window
from pyspark.sql.functions import col, lead, lag, sum as _sum

# Window specification with explicit frame boundaries
cum_window = Window.partitionBy("dept") \\
    .orderBy("id") \\
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)

df_analytics = df \\
    .withColumn("prev_salary", lag("salary", 1).over(Window.partitionBy("dept").orderBy("id"))) \\
    .withColumn("next_salary", lead("salary", 1).over(Window.partitionBy("dept").orderBy("id"))) \\
    .withColumn("running_dept_payroll", _sum("salary").over(cum_window))

df_analytics.show()`,
        type: 'Transformation',
        level: 'Advanced',
        summary: 'Accesses previous/next row values and calculates cumulative running sums over frame boundaries.',
        deepDive: '`Window.unboundedPreceding` means from the start of the partition up to `Window.currentRow`. `rowsBetween(-2, Window.currentRow)` calculates a 3-row moving calculation.'
      }
    ]
  },
  {
    id: 'strings-dates',
    number: 12,
    title: 'String, Date & Time Functions',
    description: 'Manipulating text, regex parsing, timestamp arithmetic, date formatting, and conversions.',
    iconName: 'Calendar',
    snippets: [
      {
        id: 'str-funcs',
        title: 'String Transformation Functions',
        code: `from pyspark.sql.functions import (
    col, upper, lower, initcap, trim, 
    concat, concat_ws, substring, split, regexp_replace, length
)

df_str = df.select(
    col("name"),
    upper(col("name")).alias("upper_name"),
    lower(col("name")).alias("lower_name"),
    length(col("name")).alias("char_count"),
    substring(col("name"), 1, 3).alias("prefix"),
    concat_ws(" - ", col("name"), col("dept")).alias("label"),
    split(col("name"), " ")[0].alias("first_name"),
    regexp_replace(col("dept"), "Engineering", "Software").alias("cleaned_dept")
)

df_str.show(3, truncate=False)`,
        type: 'Transformation',
        level: 'Beginner',
        summary: 'Performs string casing, substring extraction, delimiting, and regular expression replacements.',
        sqlEquivalent: `SELECT UPPER(name), LOWER(name), SUBSTRING(name, 1, 3), 
CONCAT_WS(' - ', name, dept) FROM employees;`
      },
      {
        id: 'date-funcs',
        title: 'Date & Timestamp Calculations',
        code: `from pyspark.sql.functions import (
    current_date, current_timestamp, date_format, 
    datediff, date_add, date_sub, months_between, 
    year, month, dayofmonth, to_date, to_timestamp, lit
)

# Date creation and manipulations
df_dates = df.withColumn("hire_date", to_date(lit("2023-01-15"), "yyyy-MM-dd")) \\
    .withColumn("today", current_date()) \\
    .withColumn("days_tenure", datediff(current_date(), col("hire_date"))) \\
    .withColumn("review_date", date_add(col("hire_date"), 90)) \\
    .withColumn("hire_year", year(col("hire_date"))) \\
    .withColumn("hire_month", month(col("hire_date"))) \\
    .withColumn("formatted_date", date_format(col("hire_date"), "MMMM dd, yyyy"))

df_dates.select("name", "hire_date", "days_tenure", "review_date", "formatted_date").show(3)`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Parses timestamps, calculates intervals, extracts calendar components, and formats dates.',
        proTip: 'Always specify the exact pattern in `to_date(col, "yyyy-MM-dd")`. Standard Spark 3.x uses Java DateTimeFormatter patterns (e.g. `yyyy` for year, `MM` for month, `dd` for day).'
      }
    ]
  },
  {
    id: 'udf',
    number: 13,
    title: 'User Defined Functions (UDF & Pandas UDF)',
    description: 'Extending PySpark with custom Python logic and high-performance vectorized Apache Arrow kernels.',
    iconName: 'Code',
    snippets: [
      {
        id: 'udf-standard',
        title: 'Standard Python UDF (@udf)',
        code: `from pyspark.sql.functions import udf, col
from pyspark.sql.types import StringType

# Define custom Python logic
@udf(returnType=StringType())
def format_title(name: str, dept: str) -> str:
    if not name:
        return "Unknown"
    return f"{name.upper()} [{dept}]"

# Apply to DataFrame column
df_custom = df.withColumn("display_title", format_title(col("name"), col("dept")))
df_custom.select("display_title").show(3)`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Wraps raw Python functions to execute row-by-row on distributed data.',
        deepDive: 'Standard `@udf` incurs high serialization overhead. Every single row is serialized from the JVM, piped through an IPC socket to a Python worker process, processed, and serialized back to the JVM. Furthermore, Catalyst and Tungsten optimizations are completely blind to Python bytecode!',
        commonMistake: 'Using Python UDFs when built-in `pyspark.sql.functions` already exist. Built-ins run 10x-50x faster in compiled JVM bytecode!'
      },
      {
        id: 'udf-pandas',
        title: 'Vectorized Pandas UDF (PyArrow Acceleration)',
        code: `from pyspark.sql.functions import pandas_udf
import pandas as pd

# Vectorized Pandas UDF: processes entire batches (pd.Series) at native C-speed!
@pandas_udf("double")
def calculate_tax(salary: pd.Series) -> pd.Series:
    # Vectorized operations in pandas/numpy
    return salary * 0.28

df_tax = df.withColumn("estimated_tax", calculate_tax(col("salary")))
df_tax.select("name", "salary", "estimated_tax").show(3)`,
        type: 'Transformation',
        level: 'Advanced',
        summary: 'Executes vectorized vector batch operations using Apache Arrow zero-copy memory exchange.',
        deepDive: 'Vectorized Pandas UDFs use Apache Arrow for columnar zero-copy memory sharing between JVM and Python. This eliminates row-by-row serialization, yielding performance near native Spark code.',
        proTip: 'Whenever standard Spark functions cannot satisfy your logic, choose `@pandas_udf` over standard `@udf`.'
      }
    ]
  },
  {
    id: 'sql',
    number: 14,
    title: 'SQL Queries on DataFrames',
    description: 'Querying DataFrames using full ANSI SQL syntax by registering temporary catalog views.',
    iconName: 'Terminal',
    snippets: [
      {
        id: 'sql-views',
        title: 'Create Temp Views & Run spark.sql()',
        code: `# Register DataFrame as a local temporary SQL table view
df.createOrReplaceTempView("employees")

# Execute standard SQL queries directly
result_df = spark.sql("""
    SELECT 
        dept,
        COUNT(*) AS total_staff,
        ROUND(AVG(salary), 2) AS avg_salary,
        MAX(salary) AS max_salary
    FROM employees
    WHERE salary >= 80000
    GROUP BY dept
    HAVING COUNT(*) >= 1
    ORDER BY avg_salary DESC
""")

result_df.show()

# Global temp views are shared across all sessions in the Spark application
df.createOrReplaceGlobalTempView("global_employees")
spark.sql("SELECT * FROM global_temp.global_employees").show(2)`,
        type: 'Transformation',
        level: 'Beginner',
        summary: 'Exposes DataFrames to the Spark SQL engine for querying with standard SQL dialects.',
        deepDive: 'There is zero performance penalty for using `spark.sql()` vs the DataFrame API. Both are compiled into the exact same Catalyst Logical Plan and executed by Tungsten as identical bytecode!',
        outputExample: `+-----------+-----------+----------+----------+
|       dept|total_staff|avg_salary|max_salary|
+-----------+-----------+----------+----------+
|Engineering|          2|  130000.0|  140000.0|
|    Finance|          1|  110000.0|  110000.0|
|  Marketing|          1|   85000.0|   85000.0|
+-----------+-----------+----------+----------+`
      }
    ]
  },
  {
    id: 'repartition-cache',
    number: 15,
    title: 'Repartitioning, Coalesce, Caching & Storage Levels',
    description: 'Tuning partition counts, managing shuffle data distribution, and persisting intermediate states.',
    iconName: 'Cpu',
    snippets: [
      {
        id: 'repartition-vs-coalesce',
        title: 'repartition() vs coalesce()',
        code: `# Check current number of partitions in DataFrame RDD
num_parts = df.rdd.getNumPartitions()
print(f"Current partitions: {num_parts}")

# repartition(n): Full network shuffle, balances partition sizes evenly
df_repartitioned = df.repartition(10)

# repartition by column (hash partition by department)
df_dept_parts = df.repartition(4, "dept")

# coalesce(n): Decreases partitions WITHOUT full network shuffle (merges adjacent partitions)
df_coalesced = df.coalesce(2)`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Re-distributes data across executors to increase parallelism or avoid tiny file output.',
        deepDive: 'Rule of Thumb:\\n- Need to **increase** partitions? Use `repartition(n)`.\\n- Need to **decrease** partitions before saving (e.g., from 200 to 4)? Use `coalesce(n)` to avoid unnecessary shuffles!\\n- `coalesce` cannot increase partitions; calling `df.coalesce(10)` on 2 partitions silently keeps it at 2.',
        proTip: 'A common rule of thumb is sizing partitions so each partition holds ~100MB to 200MB of uncompressed data in memory.'
      },
      {
        id: 'caching-persist',
        title: 'cache() & persist() with StorageLevel',
        code: `from pyspark import StorageLevel

# cache() is shorthand for persist(StorageLevel.MEMORY_AND_DISK)
df.cache()

# Trigger an action to materialize the cache
df.count()

# Fine-grained persistence levels
# MEMORY_ONLY: Deserialized in RAM (fastest, risk of eviction)
# MEMORY_AND_DISK: Spills to disk if RAM is exhausted
# MEMORY_AND_DISK_SER: Serialized bytes (saves RAM, small CPU deserialize cost)
# MEMORY_AND_DISK_2: Replicates across 2 worker nodes for high availability
df.persist(StorageLevel.MEMORY_AND_DISK_SER)

# ALWAYS unpersist when done to free cluster memory!
df.unpersist()`,
        type: 'Transformation',
        level: 'Intermediate',
        summary: 'Keeps reusable DataFrames in executor memory/disk across multiple downstream actions.',
        deepDive: 'Spark evaluates plans lazily. If you do `df.count()` and then `df.write...`, Spark re-evaluates the entire pipeline from disk twice unless you cache it! Cache only when a DataFrame is referenced 2+ times in separate downstream actions.',
        commonMistake: 'Caching everything. Unnecessary caching consumes executor memory pools, depriving the shuffle and execution engine and causing disk spills.'
      }
    ]
  },
  {
    id: 'write-export',
    number: 16,
    title: 'Writing & Exporting Data',
    description: 'Persisting DataFrames to disk in Parquet, CSV, Delta Lake, or partitioned folders.',
    iconName: 'Save',
    snippets: [
      {
        id: 'write-formats',
        title: 'Write to Parquet, CSV, & Partitioned Buckets',
        code: `# Write to Parquet with snappy compression (default & recommended)
df.write.mode("overwrite").parquet("output/employees.parquet")

# Write to CSV with header and custom delimiter
df.write \\
    .option("header", "true") \\
    .option("delimiter", ",") \\
    .mode("overwrite") \\
    .csv("output/employees.csv")

# Partitioned writes: Splits output directory by column (Hive partition layout)
# e.g.: output/by_dept/dept=Engineering/part-00000.parquet
df.write \\
    .partitionBy("dept") \\
    .mode("overwrite") \\
    .parquet("output/by_dept")`,
        type: 'IO',
        level: 'Beginner',
        summary: 'Saves DataFrame contents to filesystem, Cloud Storage (S3, GCS, ADLS), or lakehouses.',
        deepDive: 'The 4 save modes are:\\n- `overwrite`: Replaces existing target directory contents.\\n- `append`: Adds new partition files alongside existing ones.\\n- `ignore`: Silently skips write if target path exists.\\n- `errorIfExists` (default): Throws an AnalysisException if path exists.',
        proTip: 'When writing partitioned data (`partitionBy`), ensure the column cardinality isn\'t too high (e.g. don\'t partition by user_id or timestamp). Good partition keys: year, month, region, status.'
      }
    ]
  },
  {
    id: 'stop',
    number: 17,
    title: 'Stopping Spark Session',
    description: 'Cleanly releasing cluster resources, executor containers, and background threads.',
    iconName: 'Power',
    snippets: [
      {
        id: 'stop-session',
        title: 'Stop Active SparkSession',
        code: `# Gracefully shut down SparkSession
spark.stop()

# Or in Python context manager pattern
# with SparkSession.builder.appName("Task").getOrCreate() as spark:
#     # do processing...`,
        type: 'Config',
        level: 'Beginner',
        summary: 'Terminates the JVM gateway, active executors, and releases cloud compute quota.',
        proTip: 'Always call `spark.stop()` at the end of standalone production scripts. Failing to stop can leave orphan executor pods or YARN containers running, unnecessarily billing your cloud account.'
      }
    ]
  }
];

export interface SparkConcept {
  title: string;
  subtitle: string;
  category: string;
  summary: string;
  bullets: string[];
  codeSnippet?: string;
}

export const SPARK_CORE_CONCEPTS: SparkConcept[] = [
  {
    title: 'Transformations vs. Actions',
    subtitle: 'The Core Execution Model of Apache Spark',
    category: 'Core Architecture',
    summary: 'Spark distinguishes strictly between instructions that define a plan (Transformations) and operations that demand results (Actions).',
    bullets: [
      'Transformations (e.g., select, filter, groupBy, join, withColumn) are LAZY. They do not compute anything; they merely append an operator node to the Directed Acyclic Graph (DAG).',
      'Actions (e.g., show, count, collect, take, write, first) trigger the Catalyst Optimizer to compile the DAG into physical stages and tasks executed across worker nodes.',
      'Benefit: Allows Spark to inspect the entire end-to-end query, combining filters, eliminating unused columns, and choosing optimal join algorithms before touching data.'
    ]
  },
  {
    title: 'Narrow vs. Wide Transformations',
    subtitle: 'Why Shuffles Dictate Cluster Performance',
    category: 'Distributed Computing',
    summary: 'Every transformation in Spark is either Narrow (pipelineable in memory) or Wide (requires network shuffle).',
    bullets: [
      'Narrow Dependency: Each input partition contributes to at most one output partition (e.g. map, filter, select, withColumn). Executed 100% in-memory with zero network overhead.',
      'Wide Dependency: Multiple input partitions contribute to an output partition (e.g. groupBy, distinct, join, repartition). Requires SHUFFLE: serializing data, writing to disk, and transferring across the cluster network.',
      'Key Optimization: Minimize wide dependencies, filter early, and use broadcast joins whenever joining large tables with small lookup tables.'
    ]
  },
  {
    title: 'The Catalyst Optimizer',
    subtitle: 'How Spark Rewrites Your Code for Maximum Speed',
    category: 'Engine Internals',
    summary: 'The Catalyst framework is an extensible query optimizer at the heart of Spark SQL and DataFrames.',
    bullets: [
      'Analysis: Resolves column and table names against the Catalog schema.',
      'Logical Optimization: Applies standard rule-based optimizations such as predicate pushdown, constant folding, projection pruning, and null propagation.',
      'Physical Planning: Generates multiple physical execution strategies (e.g., BroadcastHashJoin vs SortMergeJoin) and uses Cost-Based Optimization (CBO) to pick the winner.',
      'Code Generation (Project Tungsten): Generates highly tuned Java bytecode on the fly (Whole-Stage CodeGen) that compiles operations directly into CPU registers.'
    ]
  },
  {
    title: 'Driver vs. Executors Architecture',
    subtitle: 'Distributed Master-Worker Topology',
    category: 'Cluster Architecture',
    summary: 'Spark runs as independent sets of processes on a cluster, coordinated by the SparkContext in the Driver program.',
    bullets: [
      'Driver Node: Runs the main() function of your program, constructs the SparkSession, creates the DAG, coordinates task scheduling, and collects final summary results.',
      'Cluster Manager: Allocates hardware resources (Standalone, YARN, Mesos, Kubernetes).',
      'Worker Nodes / Executors: Dedicated JVM processes running on cluster nodes. They store data partitions in RAM/disk cache and run parallel compute tasks assigned by the driver.'
    ]
  }
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PYSPARK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which of the following PySpark operations is an ACTION (triggers real distributed computation)?",
    options: [
      "df.filter(col('age') > 25)",
      "df.withColumn('bonus', col('salary') * 0.1)",
      "df.count()",
      "df.groupBy('department')"
    ],
    correctIndex: 2,
    explanation: "`df.count()` is an Action that forces Spark to execute the DAG and count the records. `filter`, `withColumn`, and `groupBy` are lazy Transformations that only build the execution plan."
  },
  {
    id: 2,
    question: "What is the key performance difference between df.coalesce(n) and df.repartition(n)?",
    options: [
      "coalesce() increases partitions, while repartition() decreases partitions.",
      "coalesce() avoids a full network shuffle when decreasing partitions, whereas repartition() always triggers a full shuffle.",
      "repartition() can only be called on CSV files.",
      "coalesce() deletes duplicate records automatically."
    ],
    correctIndex: 1,
    explanation: "`coalesce()` merges existing adjacent partitions without a full network shuffle (great for reducing partition count before writing to disk). `repartition()` performs a full shuffle across all cluster nodes and can either increase or decrease partitions."
  },
  {
    id: 3,
    question: "Why MUST you wrap compound conditions in parentheses when filtering, e.g. df.filter((col('a') > 1) & (col('b') < 5))?",
    options: [
      "It is a Python requirement because bitwise & has higher operator precedence than comparison operators like > and <.",
      "Because SQL standards enforce parenthesis around all strings.",
      "Parentheses force Spark to broadcast the table to executors.",
      "It makes the Catalyst Optimizer execute in parallel."
    ],
    correctIndex: 0,
    explanation: "In Python, bitwise `&` and `|` have higher precedence than `>` or `<`. Without parentheses, Python evaluates `1 & col('b')` first, resulting in a TypeError!"
  },
  {
    id: 4,
    question: "When joining a 10 GB transaction table with a 5 MB category dimension table, what is the best optimization?",
    options: [
      "Use df.collect() on both tables first.",
      "Use broadcast(small_table) join to replicate the 5 MB table to all executors and avoid an expensive Sort-Merge shuffle.",
      "Convert both DataFrames into Python lists.",
      "Set spark.sql.shuffle.partitions to 1."
    ],
    correctIndex: 1,
    explanation: "Broadcasting the 5 MB dimension table via `df.join(broadcast(small_df), 'key')` sends a local copy to each executor RAM, turning an expensive network shuffle join into a lightning-fast map-side join."
  },
  {
    id: 5,
    question: "Why should you avoid calling df.collect() on production big data jobs?",
    options: [
      "It permanently deletes cached partitions from memory.",
      "It returns data sorted in reverse chronological order.",
      "It pulls ALL distributed records into the single Driver memory, easily causing OutOfMemoryError.",
      "It stops the SparkSession immediately."
    ],
    correctIndex: 2,
    explanation: "`df.collect()` transfers the entire dataset across all executors back to the Driver node. If the dataset exceeds Driver RAM, the JVM crashes with an OutOfMemoryError. Use `.show(n)` or `.take(n)` instead."
  }
];
