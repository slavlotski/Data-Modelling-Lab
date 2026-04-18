# What is Data Modelling?

Data modeling is the process of creating a structured and visual representation of data. It defines **what data** is stored, **how** it is organized and **how different pieces of data relate** to each other.

Think of a data model as a blueprint — just as an architect draws plans before constructing a building, a data engineer designs a data model before creating a database.

## Why Data Modelling matters
- A poor data model leads to inconsistent data — duplicates, tables falling out of sync with each other, mismatched timezones across datetime columns and so on.
- A poor data model makes your service much harder to evolve. Adding new columns may require reinitializing the entire table history, which cascades into re-ingesting data into warehouses and lakes, recalculating data marts, and disrupting other dependent processes. Fitting new tables into an existing diagram becomes equally painful.
- Without system datetime columns such as `created_at` and `updated_at`, you violate one of the core principles of a data warehouse: that it should serve as a snapshot of your data across time.
- A poor data model makes query performance unpredictable — missing indexes, improper normalization or badly designed keys force full table scans and bloated joins that get worse as data grows
- Poor data models accumulate technical debt that is expensive to resolve
