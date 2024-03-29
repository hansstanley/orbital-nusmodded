import { Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MapIcon from "@mui/icons-material/Map";
import SettingsIcon from "@mui/icons-material/Settings";
import Roadmap from "./Roadmap";
import Settings from "./Settings";
import ModuleInfo from "./ModuleInfo";
import Landing from "./Landing";
import Account from "./Account";
import Courses from "./Courses";
import SignUp from "./SignUp";
import CourseDetail from "./Courses/CourseDetail";

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
    key: "signup",
    path: "/signup",
    content: <SignUp />,
  },
  {
    key: "landing",
    path: "/",
    content: <Landing />,
  },
  {
    key: "courseDetail",
    path: "/courses/detail",
    content: <CourseDetail />,
  },
];

export default pages;
