# ⚡ PySpark Mastery • Interactive Cheat Sheet & Deep-Dive Learning Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Apache Spark](https://img.shields.io/badge/Apache_Spark-3.x-E25A1C?logo=apachespark&logoColor=white)](https://spark.apache.org/)

An interactive, high-performance web application and comprehensive cheat sheet for mastering **Apache Spark** with **PySpark 3.x**. Designed for data engineers, data scientists, and analysts — from complete beginners to advanced practitioners.

---

## 🌟 Key Features

1. **Terminal Cheat Sheet Mode (Image Replica)**
   - Replicates the sleek dark macOS terminal cheat sheet with colored syntax highlighting, line numbers, and fast copy actions.
   - Click any snippet to open an in-depth breakdown with input/output DataFrame tables.

2. **Interactive In-Depth Guide**
   - 17 core PySpark modules with clear explanations, code examples, expected output tables, SQL equivalents, and Catalyst optimizer tips.
   - Instant search across functions, keywords, and SQL parallels.
   - Filter by skill level (Beginner, Intermediate, Advanced) and operation type (Lazy Transformations vs Eager Actions).

3. **Apache Spark Architecture & Engine Internals**
   - Interactive visual diagrams illustrating the **Driver vs Executor** topology.
   - 4-stage **Catalyst Optimizer** pipeline (Analysis, Logical Plan, Physical Plan, Tungsten Whole-Stage CodeGen).
   - Deep dive into **Narrow vs Wide Dependencies (Shuffles)** and how to optimize data distribution.

4. **Live Execution Playground**
   - Experiment with common transformations (`filter`, `withColumn`, `when/otherwise`, `groupBy`, `Window`, `broadcast join`) and inspect how the resulting DataFrame table updates step-by-step.

5. **PySpark Mastery Quiz**
   - 5 interactive assessment questions testing understanding of Lazy Evaluation, partition tuning, bitwise operator precedence, and memory pitfalls.

6. **Print & Offline Ready**
   - Fully client-side with clean print stylesheet for generating single-page PDFs or printable cheat sheets.

---

## 📚 Covered PySpark Modules (17 Sections)

| # | Topic | Key Operations |
|---|---|---|
| **1** | **Initializing SparkSession** | `SparkSession.builder`, `.master("local[*]")`, `shuffle.partitions`, Spark UI |
| **2** | **Creating & Reading DataFrames** | `spark.read.csv`, `read.parquet`, `read.json`, `createDataFrame`, explicit `StructType` |
| **3** | **Inspecting & Exploring Data** | `df.show()`, `printSchema()`, `count()`, `describe()`, `summary()`, `head()`, `take()` |
| **4** | **Selecting & Filtering Columns** | `df.select()`, `col()`, `filter()`, `where()`, bitwise `&`, `\|`, `~`, `isin()`, `like()`, `rlike()` |
| **5** | **Adding, Renaming & Dropping** | `df.withColumn()`, `lit()`, `withColumnRenamed()`, `toDF()`, `drop()`, `cast()` |
| **6** | **Conditional Logic** | `when()`, `otherwise()`, inline SQL `expr("CASE WHEN ... END")` |
| **7** | **Grouping & Aggregations** | `groupBy()`, `agg()`, `count()`, `avg()`, `min()`, `max()`, `sum()`, `pivot()` |
| **8** | **Sorting & Ordering** | `sort()`, `orderBy()`, `asc()`, `desc_nulls_last()`, `sortWithinPartitions()` |
| **9** | **Handling Null Values** | `df.na.drop()`, `df.na.fill()`, `df.na.replace()`, `isNull()`, `coalesce()` |
| **10** | **Joins & Join Optimization** | `inner`, `left`, `right`, `outer`, `semi`, `anti`, `broadcast(small_df)` join |
| **11** | **Window Functions** | `Window.partitionBy()`, `row_number()`, `rank()`, `dense_rank()`, `lead()`, `lag()`, `rowsBetween()` |
| **12** | **String & Date Functions** | `upper()`, `lower()`, `concat_ws()`, `split()`, `to_date()`, `date_add()`, `datediff()` |
| **13** | **User Defined Functions (UDFs)** | Standard Python `@udf` vs High-Performance Vectorized `@pandas_udf` (Apache Arrow) |
| **14** | **Spark SQL on DataFrames** | `createOrReplaceTempView()`, `spark.sql()`, cross-catalog views |
| **15** | **Partitioning & Caching** | `repartition()` vs `coalesce()`, `cache()`, `persist(StorageLevel)`, `unpersist()` |
| **16** | **Writing & Exporting Data** | `write.parquet()`, `write.csv()`, `partitionBy()`, save modes (`overwrite`, `append`) |
| **17** | **Stopping Spark Session** | `spark.stop()` resource cleanup |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ 
- **npm** v9+

### 2. Installation & Local Development
```bash
# Clone the repository
git clone https://github.com/debadityadutta25/pyspark-cheat-sheet.git
cd pyspark-cheat-sheet

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
The compiled, production-ready static assets will be output to the `dist/` directory.

---

## 🌐 Hosting on GitHub Pages

This project is pre-configured for automated continuous deployment to **GitHub Pages**:

1. A GitHub Actions workflow is provided at `.github/workflows/deploy.yml`.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions** (or deploy directly from the `gh-pages` branch).
4. Whenever you push changes to the `main` branch, the workflow will automatically build and publish the site!

---

## 📄 License
Released under the [MIT License](LICENSE).
