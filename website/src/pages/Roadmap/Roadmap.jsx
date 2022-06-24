import ModuleStack from "./ModuleStack";
import { ResponsiveStack } from "../../components";
import { AuthGuard } from "../../components";
import { useAuthSession } from "../../providers";

export default function Roadmap() {
  const { isAuth } = useAuthSession();
  return (
    <>
      <ResponsiveStack>
        {isAuth() 
        ? <ModuleStack />
        : <AuthGuard />
        }
      </ResponsiveStack>
    </>
  );
}
