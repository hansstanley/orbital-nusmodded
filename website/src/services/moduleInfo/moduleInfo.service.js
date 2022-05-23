import axios from "axios";
import ModuleInfo from "./moduleInfo.class.js";
import { plainToInstance } from "class-transformer";

const ACAD_YEAR = "2021-2022";
// 'proxy' property in package.json as a temporary workaround to CORS
const DETAILED_INFO_API = `https://api.nusmods.com/v2/${ACAD_YEAR}/moduleInfo.json`;

export default class ModuleInfoService {
  #modules = new Map();

  #getDetailedInfo = async () => {
    console.log("Retrieving detailed module info...");
    const detailedInfo = await axios.get(DETAILED_INFO_API);
    console.log("Retrieved detailed module info!");
    return detailedInfo;
  };

  /**
   * Loads the module information from NUSMods.
   * @returns This instance of ModuleService.
   */
  buildModules = async () => {
    const detailedInfo = await this.#getDetailedInfo();
    detailedInfo.data.forEach((info) => {
      const moduleInfo = plainToInstance(ModuleInfo, info);
      this.#modules.set(moduleInfo.moduleCode, moduleInfo);
    });
    return this;
  };

  /**
   * Returns the detailed information of a module.
   * @param {string} moduleCode The module code.
   * @returns The corresponding module.
   */
  getModule = (moduleCode) => {
    return this.#modules.get(moduleCode);
  };

  /**
   * Returns a list of all modules.
   * @returns An array of modules.
   */
  getModuleList = () => {
    return Array.from(this.#modules.values());
  };

  getModuleMap = () => {
    return this.#modules;
  };
}
