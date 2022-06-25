import ModuleStack from "./ModuleStack";
import { ResponsiveStack } from "../../components";
import { AuthGuard } from "../../components";

export default function Roadmap() {
  return (
    <AuthGuard>
      <ResponsiveStack>
        <ModuleStack />
      </ResponsiveStack>
    </AuthGuard>
  );
}
