import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { HomePage } from "./pages/HomePage";
import { ModuleListPage } from "./pages/ModuleListPage";
import { ModulePage } from "./pages/ModulePage";
import { SandboxPage } from "./pages/SandboxPage";
import { ChallengeListPage } from "./pages/ChallengeListPage";
import { ChallengePage } from "./pages/ChallengePage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/modules" element={<ModuleListPage />} />
        <Route path="/modules/:id" element={<ModulePage />} />
        <Route path="/modules/:id/:section" element={<ModulePage />} />
        <Route path="/sandbox" element={<SandboxPage />} />
        <Route path="/challenges" element={<ChallengeListPage />} />
        <Route path="/challenges/:slug" element={<ChallengePage />} />
      </Routes>
    </AppShell>
  );
}
