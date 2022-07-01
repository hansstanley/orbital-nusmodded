import { AuthGuard } from "../../components";
import RoadmapStack from "./RoadmapStack";

export default function Roadmap() {
  return (
    <AuthGuard>
      <RoadmapStack />
    </AuthGuard>
  );
}
