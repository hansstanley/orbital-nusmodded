import { Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MapIcon from "@mui/icons-material/Map";
import SettingsIcon from "@mui/icons-material/Settings";
import Roadmap from "./Roadmap";
import Settings from "./Settings";
import ModuleInfo from "./ModuleInfo";
import Landing from "./Landing";
import Auth from "./Auth";
import Account from "./Account";
import Courses from "./Courses";
import SignUp from "./SignUp";


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
    isDrawerItem: true,
    key: "courses",
    path: "/courses",
    icon: <MenuBookIcon />,
    title: "Courses",
    content: <Courses />,
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
    isDrawerItem: true,
    key: "account",
    path: "/me",
    icon: <AccountCircleIcon />,
    title: "Account",
    content: <Account />,
  },
  {
    key: "login",
    path: "/login",
    content: <Auth />,
  },
  {
    key: "signup",
    path: "/signup",
    content: <SignUp />,
  },
  {
    key: "landing",
    path: "/",
    content: <Landing />,
  },
];

export default pages;
