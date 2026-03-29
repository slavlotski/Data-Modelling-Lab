export interface Attribute {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  nullable: boolean;
}

export interface EntityData extends Record<string, unknown> {
  name: string;
  attributes: Attribute[];
}

export type Cardinality = "1:1" | "1:N" | "N:1" | "M:N";

export interface RelationshipData {
  label: string;
  cardinality: Cardinality;
}

export interface SchemaSnapshot {
  tables: TableInfo[];
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  constraints: ConstraintInfo[];
  indexes: IndexInfo[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string | null;
}

export interface ConstraintInfo {
  name: string;
  type: string;
  columns: string[];
  referencedTable?: string;
  referencedColumns?: string[];
  definition?: string;
}

export interface IndexInfo {
  name: string;
  columns: string[];
  unique: boolean;
  method: string;
}
