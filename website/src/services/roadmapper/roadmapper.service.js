export default class RoadmapperService {
  #roadmap = [
    {
      year: 1,
      semester: 1,
      modules: ["CS1101S", "CS1231S", "MA1521", "GEA1000", "IS1103"],
    },
    {
      year: 1,
      semester: 2,
      modules: ["CS2030S", "CS2040S", "CS2100", "MA2001", "ST2334"],
    },
    {
      year: 2,
      semester: 1,
      modules: ["CS2103T", "CS2101", "CS2109S", "ES2660", "FSC2101"],
    },
    {
      year: 2,
      semester: 2,
      modules: ["CS3230", "AC5001", "MA1521", "GEA1000", "IS1103"],
    },
    {
      year: 3,
      semester: 1,
      modules: ["CS1101S", "CS2106", "GEC1000", "GEQ1000H", "CS3244"],
    },
    {
      year: 3,
      semester: 2,
      modules: ["CS4246", "CS4243", "IFS4103", "IFS4202", "GES1003"],
    },
    {
      year: 4,
      semester: 1,
      modules: [
        "CP3880",
        "CP4101",
        "CP3880",
        "CP4101",
        "CP3880",
        "CP4101",
        "CP3880",
        "CP4101",
        "CP3880",
        "CP4101",
      ],
    },
    {
      year: 4,
      semester: 2,
      modules: ["CS5242", "CS5340", "CS5446"],
    },
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
