import { Divider } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MapIcon from "@mui/icons-material/Map";
import SettingsIcon from "@mui/icons-material/Settings";
import Roadmap from "./Roadmap";
import Settings from "./Settings";
import Login from "./Login";
import ModuleInfo from "./ModuleInfo";

const pages = [
  {
    isDrawerItem: true,
    key: "roadmap",
    path: "/roadmap",
    icon: <MapIcon />,
    title: "Roadmap",
    content: <Roadmap />,
  },
  {
    isDrawerItem: true,
    key: "moduleInfo",
    path: "/module-info",
    icon: <AutoStoriesIcon />,
    title: "Modules",
    content: <ModuleInfo />,
  },
  {
    isDrawerAccessory: true,
    content: <Divider key={"divider1"} />,
  },
  {
    isDrawerItem: true,
    key: "settings",
    path: "/settings",
    icon: <SettingsIcon />,
    title: "Settings",
    content: <Settings />,
  },
  {
    key: "login",
    path: "/login",
    content: <Login />,
  },
];

export default pages;
