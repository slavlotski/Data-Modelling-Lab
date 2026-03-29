import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchModules } from "../../api/modules";

export function Sidebar() {
  const { data: modules } = useQuery({
    queryKey: ["modules"],
    queryFn: fetchModules,
  });

  return (
    <aside className="flex w-60 flex-col bg-notion-bg-gray">
      <div className="flex h-11 items-center px-4 pt-3 pb-1">
        <span className="text-sm font-semibold text-notion-text">Data Modelling Lab</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 rounded px-2 py-1 text-sm transition-colors ${
              isActive
                ? "bg-notion-bg-hover text-notion-text"
                : "text-notion-text-secondary hover:bg-notion-bg-hover"
            }`
          }
        >
          Home
        </NavLink>

        {modules && modules.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-1 px-2 text-xs font-medium text-notion-text-secondary">
              Modules
            </h3>
            <ul className="space-y-px">
              {modules.map((m) => (
                <li key={m.id}>
                  <NavLink
                    to={`/modules/${m.id}`}
                    className={({ isActive }) =>
                      `block rounded px-2 py-1 text-sm transition-colors ${
                        isActive
                          ? "bg-notion-bg-hover text-notion-text"
                          : "text-notion-text-secondary hover:bg-notion-bg-hover"
                      }`
                    }
                  >
                    {m.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}
