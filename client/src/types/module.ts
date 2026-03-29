export interface ModuleMeta {
  id: string;
  title: string;
  order: number;
  description: string;
  part: string;
  prerequisites: string[];
}

export interface ModuleSection {
  slug: string;
  title: string;
  content: string;
  order: number;
}

export interface ModuleWithSections extends ModuleMeta {
  sections: ModuleSection[];
}
