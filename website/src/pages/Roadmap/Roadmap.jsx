import ModuleStack from "./ModuleStack";
import { ResponsiveStack } from "../../components";
import RoadmapFab from "./RoadmapFab";

export default function Roadmap() {
  return (
    <>
      <ResponsiveStack>
        <ModuleStack />
        <RoadmapFab />
      </ResponsiveStack>
    </>
  );
}
