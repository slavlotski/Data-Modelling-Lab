import { useParams, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchModule } from "../api/modules";
import { TheoryRenderer } from "../components/theory/TheoryRenderer";

export function ModulePage() {
  const { id, section } = useParams<{ id: string; section?: string }>();
  const { data: mod, isLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: () => fetchModule(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="text-notion-text-secondary">Loading...</div>;
  if (!mod) return <div className="text-notion-red">Module not found.</div>;

  const currentSection = section
    ? mod.sections.find((s) => s.slug === section)
    : mod.sections[0];

  return (
    <div>
      <div className="mb-6">
        <div className="text-sm text-notion-text-secondary mb-1">{mod.part}</div>
        <h1 className="text-[2rem] font-bold text-notion-text leading-tight">{mod.title}</h1>
      </div>

      <div className="flex gap-1 mb-8 border-b border-notion-border">
        {mod.sections.map((s) => (
          <NavLink
            key={s.slug}
            to={`/modules/${id}/${s.slug}`}
            className={({ isActive }) =>
              `px-3 py-2 text-sm transition-colors border-b-2 -mb-px ${
                isActive || (!section && s.order === 0)
                  ? "border-notion-text text-notion-text font-medium"
                  : "border-transparent text-notion-text-secondary hover:text-notion-text"
              }`
            }
          >
            {s.title}
          </NavLink>
        ))}
      </div>

      <div>
        {currentSection ? (
          <TheoryRenderer content={currentSection.content} />
        ) : (
          <p className="text-notion-text-secondary">Select a section.</p>
        )}
      </div>
    </div>
  );
}
