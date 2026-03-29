import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-sm font-medium text-gray-500">Data Modelling Lab</h1>
      <Link
        to="/settings"
        className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <Settings className="h-5 w-5" />
      </Link>
    </header>
  );
}
