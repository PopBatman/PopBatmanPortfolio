import { Canvas } from "./workspace/canvas";
import { WorkspaceShell } from "./workspace/workspace-shell";

export default function HomePage() {
  return (
    <WorkspaceShell>
      <Canvas />
    </WorkspaceShell>
  );
}
