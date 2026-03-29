import Editor from "@monaco-editor/react";
import { useSettingsStore } from "../../stores/settingsStore";

interface Props {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export function SqlEditor({ value, onChange, height = "300px" }: Props) {
  const fontSize = useSettingsStore((s) => s.editorFontSize);

  return (
    <Editor
      height={height}
      defaultLanguage="sql"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      theme="vs-dark"
      options={{
        fontSize,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        lineNumbers: "on",
        tabSize: 2,
        automaticLayout: true,
      }}
    />
  );
}
