export default class RoadmapperService {
  #roadmap = [
    {
      id: 1,
      year: 1,
      semester: 1,
      modules: ["CS1101S", "CS1231S", "MA1521", "GEA1000", "IS1103"],
    },
    {
      id: 2,
      year: 1,
      semester: 2,
      modules: ["CS2030S", "CS2040S", "CS2100", "MA2001", "ST2334"],
    },
    {
      id: 3,
      year: 2,
      semester: 1,
      modules: ["CS2103T", "CS2101", "CS2109S", "ES2660", "FSC2101"],
    },
    {
      id: 4,
      year: 2,
      semester: 2,
      modules: ["CS3230", "AC5001", "MA1100", "ST1131", "DAO1704"],
    },
    {
      id: 5,
      year: 3,
      semester: 1,
      modules: ["BT2102", "CS2106", "GEC1000", "GEQ1000H", "CS3244"],
    },
    {
      id: 6,
      year: 3,
      semester: 2,
      modules: ["CS4246", "CS4243", "IFS4103", "IFS4202", "GES1003"],
    },
    {
      id: 7,
      year: 4,
      semester: 1,
      modules: [
        "CP3880",
        "CS2102",
        "CS1010",
        "CP4101",
        "DAO1704X",
        "FIN2704",
        "GESS1025",
        "GEC1005",
        "GEC1015",
        "GEC1020",
      ],
    },
    {
      id: 8,
      year: 4,
      semester: 2,
      modules: ["CS5242", "CS5340", "CS5446"],
    },
    {
      id: -1,
      year: null,
      semester: null,
      modules: ["CS1010X"],
    }
  ];

  getRoadmap() {
    return this.#roadmap;
  }

  getYearCount() {
    return this.#roadmap.reduce((prev, curr) => (curr > prev ? curr : prev));
  }

  getSemesterCount() {
    return this.#roadmap.length;
  }

  getAllModules() {
    const mods = this.#roadmap.reduce((prev, curr) => prev.concat(curr.modules), []);
    return mods;
  }

  getModulesFor(year, semester) {
    for (const sem of this.#roadmap) {
      if (sem.year === year && sem.semester === semester) {
        return sem.modules;
      }
    }

    return [];
  }
}
