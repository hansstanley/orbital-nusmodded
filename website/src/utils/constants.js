import { NIL, v4, v5 } from "uuid";

export const BACKEND_DOMAIN = "https://nusmodded.herokuapp.com";
// export const BACKEND_DOMAIN = "http://localhost:3002";

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
  TEMPLATE: () => {
    const res = [];
    [1, 2, 3, 4].forEach((year) => {
      [1, 2].forEach((semester) => {
        res.push({
          id: v4(),
          year,
          semester,
          modules: [],
        });
      });
    });

    return res;
  },
};

export const ROADMAP_TEMPLATE = [
  {
    id: 1,
    year: 1,
    modules: [],
    semester: 1,
  },
  {
    id: 2,
    year: 1,
    modules: [],
    semester: 2,
  },
  {
    id: 3,
    year: 2,
    modules: [],
    semester: 1,
  },
  {
    id: 4,
    year: 2,
    modules: [],
    semester: 2,
  },
  {
    id: 5,
    year: 3,
    modules: [],
    semester: 1,
  },
  {
    id: 6,
    year: 3,
    modules: [],
    semester: 2,
  },
  {
    id: 7,
    year: 4,
    modules: [],
    semester: 1,
  },
  {
    id: 8,
    year: 4,
    modules: [],
    semester: 2,
  },
  {
    id: -1,
    year: null,
    modules: [],
    semester: null,
  },
];
