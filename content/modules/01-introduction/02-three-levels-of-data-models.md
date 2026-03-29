# The Three Levels of Data Models

Data modelling happens at three levels of abstraction. Each level serves a different purpose.

## 1. Conceptual Data Model

The conceptual model is the **highest level of abstraction**. It captures the major entities in the business domain and the relationships between them — nothing more.

## 2. Logical Data Model

The logical model adds **detail** to the conceptual model. It defines:

- All entities and their attributes
- Primary and foreign keys
- Relationships with explicit cardinality (1:1, 1:N, M:N)
- Data types at an abstract level (string, integer, date — not vendor-specific)
- Normalization rules

## 3. Physical Data Model

The physical model is the **implementation blueprint**. It maps the logical model to a specific database system.


## Key Takeaway

> The conceptual model captures the **business perspective**, the logical model captures the **data perspective**, and the physical model captures the **technology perspective**. A good data modeller moves fluently between all three.
