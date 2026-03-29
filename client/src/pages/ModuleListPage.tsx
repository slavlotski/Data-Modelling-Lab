import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchModules } from "../api/modules";

export function ModuleListPage() {
  const { data: modules, isLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: fetchModules,
  });

  if (isLoading) return <div className="text-notion-text-secondary">Loading modules...</div>;

  return (
    <div>
      <h1 className="text-[2rem] font-bold text-notion-text mb-8">Modules</h1>

      <div className="space-y-px">
        {modules?.map((m) => (
          <Link
            key={m.id}
            to={`/modules/${m.id}`}
            className="flex items-center gap-4 rounded-md px-3 py-2.5 -mx-3 transition-colors hover:bg-notion-bg-hover"
          >
            <span className="text-sm text-notion-text-secondary w-6 text-right">
              {m.order}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-notion-text">{m.title}</div>
              <div className="text-sm text-notion-text-secondary truncate">{m.description}</div>
            </div>
            <span className="text-xs text-notion-text-secondary">
              {m.part}
            </span>
          </Link>
        ))}

        {modules?.length === 0 && (
          <p className="text-notion-text-secondary text-sm">
            No modules found. Add content to the content/modules/ directory.
          </p>
        )}
      </div>
    </div>
  );
}
