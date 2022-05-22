import axios from "axios";
import Module from "./module.class.js";
import { plainToInstance } from "class-transformer";

const ACAD_YEAR = "2021-2022";
// 'proxy' property in package.json as a temporary workaround to CORS
const DETAILED_INFO_API = `${ACAD_YEAR}/moduleInfo.json`;

export default class ModuleService {
  #modules = new Map();

  #getDetailedInfo = async () => {
    console.log("Getting detailed module info...");
    const detailedInfo = await axios.get(DETAILED_INFO_API);
    return detailedInfo;
  };

  buildModules = async () => {
    const detailedInfo = await this.#getDetailedInfo();
    detailedInfo.data.forEach((moduleInfo) => {
      const module = plainToInstance(Module, moduleInfo);
      this.#modules.set(module.moduleCode, module);
    });
  };

  getModule = (moduleCode) => {
    return this.#modules.get(moduleCode);
  };

  getModuleList = () => {
    return Array.from(this.#modules.values());
  };
}
