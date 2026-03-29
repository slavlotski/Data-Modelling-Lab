import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useDiagramStore } from "../../stores/diagramStore";
import type { Attribute } from "../../types/diagram";

const PG_TYPES = [
  "integer", "bigint", "smallint", "serial", "bigserial",
  "varchar", "text", "char",
  "boolean",
  "date", "timestamp", "timestamptz", "time",
  "numeric", "decimal", "real", "double precision",
  "uuid", "jsonb", "json",
];

interface Props {
  onClose: () => void;
}

export function EntityDialog({ onClose }: Props) {
  const [name, setName] = useState("");
  const [attributes, setAttributes] = useState<Attribute[]>([
    { name: "id", type: "serial", isPrimaryKey: true, isForeignKey: false, nullable: false },
  ]);
  const addEntity = useDiagramStore((s) => s.addEntity);

  function addAttribute() {
    setAttributes([
      ...attributes,
      { name: "", type: "varchar", isPrimaryKey: false, isForeignKey: false, nullable: true },
    ]);
  }

  function updateAttribute(index: number, updates: Partial<Attribute>) {
    setAttributes(attributes.map((a, i) => (i === index ? { ...a, ...updates } : a)));
  }

  function removeAttribute(index: number) {
    setAttributes(attributes.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addEntity(name.trim(), attributes.filter((a) => a.name.trim()));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Entity</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Table Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. customers"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            autoFocus
          />
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Attributes</label>
            <button
              type="button"
              onClick={addAttribute}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {attributes.map((attr, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={attr.name}
                  onChange={(e) => updateAttribute(i, { name: e.target.value })}
                  placeholder="column name"
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
                <select
                  value={attr.type}
                  onChange={(e) => updateAttribute(i, { type: e.target.value })}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                >
                  {PG_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={attr.isPrimaryKey}
                    onChange={(e) => updateAttribute(i, { isPrimaryKey: e.target.checked })}
                  />
                  PK
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={attr.nullable}
                    onChange={(e) => updateAttribute(i, { nullable: e.target.checked })}
                  />
                  NULL
                </label>
                <button
                  type="button"
                  onClick={() => removeAttribute(i)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
