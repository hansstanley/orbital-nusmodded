import { AuthGuard } from "../../components";
import RoadmapStack from "./RoadmapStack";
import StatusFab from "./StatusFab";

export default function Roadmap() {
  return (
    <AuthGuard>
      <RoadmapStack />
      <StatusFab />
    </AuthGuard>
  );
}
