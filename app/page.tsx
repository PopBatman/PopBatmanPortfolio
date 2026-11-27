import {
  professionalContent,
  validateContent,
} from "./content/professional-content";
import { WorkspaceShell } from "./workspace/workspace-shell";

export default function HomePage() {
  const errors = validateContent(professionalContent);
  if (errors.length) throw new Error(errors.join("\n"));
  return <WorkspaceShell />;
}
