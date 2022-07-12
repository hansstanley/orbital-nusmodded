import { NIL, v4, v5 } from "uuid";
import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";

export const BACKEND_DOMAIN = "https://nusmodded.herokuapp.com";
// export const BACKEND_DOMAIN = "http://localhost:3002";

export const COLORS = {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
};

export const AUTH_EVENT = {
  SIGNED_IN: "SIGNED_IN",
  SIGNED_OUT: "SIGNED_OUT",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED",
  PASSWORD_RECOVERY: "PASSWORD_RECOVERY",
  TOKEN_REFRESHED: "TOKEN_REFRESHED",
};

export const SEMESTER_TITLE = {
  1: "Semester 1",
  2: "Semester 2",
  3: "Special Term (Part 1)",
  4: "Special Term (Part 2)",
};

export const ROADMAP = {
  MY_MODS_ID: v5("MY_MODS", NIL),
  COURSE_MODS_ID: v5("COURSE_MODS", NIL),
  YEAR_MAX_COUNT: 10,
  TEMPLATE: () => {
    const colorKeys = Object.keys(COLORS);

    const res = [];
    [1, 2, 3, 4].forEach((year) => {
      [1, 2].forEach((semester) => {
        res.push({
          id: v4(),
          year,
          semester,
          modules: [],
          bgColor: colorKeys[Math.floor(Math.random() * colorKeys.length)],
        });
      });
    });

    return res;
  },
};

export const SETTINGS = {
  COURSE: {
    ID: "COURSE_ID",
  },
  MC_LIMIT: {
    ID: "MC_LIMIT",
  },
};
