import { Link } from "react-router-dom";

const curriculum = [
  { part: "I", title: "Relational Foundations", modules: "Modules 1-4" },
  { part: "II", title: "Dimensional Modelling (Kimball)", modules: "Modules 5-9" },
  { part: "III", title: "Inmon (Enterprise DW)", modules: "Modules 10-11" },
  { part: "IV", title: "Data Vault 2.0", modules: "Modules 12-13" },
  { part: "V", title: "Anchor Modelling", modules: "Module 14" },
  { part: "VI", title: "Synthesis & Capstone", modules: "Modules 15-16" },
];

export function HomePage() {
  return (
    <div>
      <h1 className="text-[2.5rem] font-bold text-notion-text leading-tight mb-2">
        Data Modelling Lab
      </h1>
      <p className="text-lg text-notion-text-secondary mb-10 leading-relaxed">
        Learn data modelling from relational fundamentals to advanced warehouse
        architectures. Kimball, Inmon, Data Vault, and Anchor Modelling — all in
        one place.
      </p>

      <Link
        to="/modules"
        className="inline-block rounded-md bg-notion-text text-white px-4 py-2 text-sm font-medium hover:bg-notion-text/90 transition-colors mb-12"
      >
        Start Learning
      </Link>

      <h2 className="text-xl font-semibold text-notion-text mb-4">Curriculum</h2>
      <div className="space-y-px">
        {curriculum.map((p) => (
          <div
            key={p.part}
            className="flex items-center gap-4 py-2 border-b border-notion-border last:border-0"
          >
            <span className="text-sm font-medium text-notion-text-secondary w-12">
              Part {p.part}
            </span>
            <span className="text-sm text-notion-text">{p.title}</span>
            <span className="ml-auto text-sm text-notion-text-secondary">
              {p.modules}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
