# Entity Relationships and Keys in Relational Databases

## Why Relationships Matter

Data rarely exists in isolation. A user participates in chats, a chat contains messages, a message may have attachments — all of these are relationships between entities. In a relational database, these relationships are expressed through links between tables.

---

## Relationship Types

### 1 : 1 — One-to-One

Each record in table A corresponds to exactly one record in table B and vice versa.

**Example:** one user — one profile (`users` → `user_profiles`).

A profile cannot belong to multiple users and a user cannot have multiple profiles.

One-to-one relationships are rare. They typically appear for one of two reasons:

**Vertical partitioning** — a wide table is split into two based on access frequency. For example, `users` contains `id`, `email`, `created_at` — fields read on every request. `user_profiles` contains `bio`, `avatar_url`, `timezone` — fields needed only on the settings page. Splitting reduces the amount of data read in a single I/O for hot queries.

**Strict entity correspondence** — when a business rule requires one entity to exist only in pair with another. `User` ↔ `UserSettings` — every user gets a settings record created at registration. Settings cannot exist without a user and every user must have settings.

**Mandatory relationship:** a profile is created at registration — neither side exists without the other.

**Optional relationship:** a profile is created later, on first visit to settings — until then, no record exists in `user_profiles`.

---

### 1 : M — One-to-Many

One record in table A can be associated with many records in table B. The most common relationship type.

**Examples in the chat model:**

| "One" side   | "Many" side   | Mandatory?                                        |
|--------------|---------------|---------------------------------------------------|
| `chats`      | `messages`    | optional — a chat can be empty                    |
| `users`      | `messages`    | mandatory - every message is sent by a specific user |
| `messages`   | `attachments` | optional - a message may have no attachments      |

---

### M : M — Many-to-Many

One record in table A can be associated with many records in table B and vice versa.

**Example in the chat model:**

- `users` ↔ `chats` — a user participates in many chats, a chat contains many users.

A many-to-many relationship cannot be implemented directly in a relational database. A junction table is introduced between the two tables. It stores pairs of foreign keys: `(user_id, chat_id)`. More on this in the normalization topic.

---

## Relationship Cardinality

Any relationship type can be mandatory or optional on either side. In the schema this is expressed through `NOT NULL` (mandatory) or `NULL` (optional) on the foreign key.

---

## Keys

Keys provide unique identification of records and ensure data integrity between tables.

### Primary Key (PK)

A unique identifier for a row in a table.

**Requirements:** unique for every row, cannot be `NULL`.

**Simple key** — a single attribute: `message_id`.

**Composite key** — multiple attributes. For example, in the junction table `chat_members` the pair `(user_id, chat_id)` is unique together, even though each value repeats individually.

---

**Natural key** — a value from the business domain: `email`, `phone`.

> Problem: natural keys are unstable. A user can change their email — and all references to it break. They carry business meaning, so a change in business rules breaks the schema.

**Surrogate key** — a field generated artificially, with no meaning from the business domain. Typically named `id` or containing `_id`: `user_id`, `chat_id`, `message_id`.

Two main generation approaches:

| Approach       | Description                                                      |
|----------------|------------------------------------------------------------------|
| Auto-increment | `1, 2, 3, ...` — each next ID is one greater than the previous   |
| UUID           | A long string of characters, unique without central coordination |

A UUID looks like this: `550e8400-e29b-41d4-a716-446655440000`. Uniqueness is achieved through high bit-width and a special generation algorithm. In a chat service running on multiple servers, auto-increment is problematic: two servers can independently create a message with `id = 1001`. UUID eliminates this issue.

---

### Foreign Key (FK)

A field in a child table that references the primary key of a parent table.

**Guarantees referential integrity:** a child table cannot contain a reference to a non-existent record.

**Example:** `messages.chat_id` → `chats.id`

When a chat is deleted, three behaviors are possible — chosen at schema design time:

| Behavior          | SQL                  | What happens to messages                              |
|-------------------|----------------------|-------------------------------------------------------|
| Cascade delete    | `ON DELETE CASCADE`  | Deleted together with the chat                        |
| Nullify reference | `ON DELETE SET NULL` | Preserved, `chat_id` becomes `NULL`                   |
| Prevent deletion  | `ON DELETE RESTRICT` | Deletion of the chat is blocked while messages exist  |

For a chat, `CASCADE` is the natural choice — messages without a chat have no meaning. The same applies to attachments: an attachment without a message is meaningless.

`NULL` on a FK is also the standard state for an optional relationship: a message with no attachments simply has no records in the `attachments` table.
