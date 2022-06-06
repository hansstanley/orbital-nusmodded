import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { ModDetailDto, ModInfoDto, ModSummaryDto } from './dto';

const NUSMODS_API_URL = 'https://api.nusmods.com/v2';
const ACAD_YEAR = '2021-2022';

@Injectable()
export class NusmodsService {
  private summaries: ModSummaryDto[] = undefined;
  private details: ModDetailDto[] = undefined;
  private modInfo = new Map<string, ModInfoDto>();

  constructor(private httpService: HttpService) { }

  /**
   * Retrieves the list of module summaries from NUSMods.
   * 
   * @returns An array of module summaries.
   */
  async getSummaries(): Promise<ModSummaryDto[]> {
    if (this.summaries) return this.summaries;

    const moduleList = await lastValueFrom(this.httpService
      .get(`${NUSMODS_API_URL}/${ACAD_YEAR}/moduleList.json`)
      .pipe(map((res) => res.data)));

    if (Array.isArray(moduleList)) {
      this.summaries = moduleList.map((mod) => plainToInstance(ModSummaryDto, mod));
      return this.summaries;
    } else {
      throw new HttpException(
        `Unable to retrieve module summaries`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Retrieves the list of detailed module information from NUSMods.
   * 
   * @returns An array of module details.
   */
  async getDetails(): Promise<ModDetailDto[]> {
    if (this.details) return this.details;

    const moduleList = await lastValueFrom(this.httpService
      .get(`${NUSMODS_API_URL}/${ACAD_YEAR}/moduleInfo.json`)
      .pipe(map((res) => res.data)));

    if (Array.isArray(moduleList)) {
      this.details = moduleList.map((mod) => plainToInstance(ModDetailDto, mod));
      return this.details;
    } else {
      throw new HttpException(
        `Unable to retrieve module details`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Retrieves the comprehensive module information
   * for a given module code.
   * 
   * @param moduleCode The module code of the desired module.
   * @returns The comprehensive module information.
   */
  async getModuleInfo(moduleCode: string): Promise<ModInfoDto> {
    if (this.modInfo.has(moduleCode)) return this.modInfo.get(moduleCode);

    const res = await lastValueFrom(this.httpService
      .get(`${NUSMODS_API_URL}/${ACAD_YEAR}/modules/${moduleCode}.json`)
      .pipe(catchError((err) => of(err.response))));

    if (res.status === HttpStatus.NOT_FOUND) {
      throw new HttpException(
        `Module ${moduleCode} does not exist`,
        HttpStatus.NOT_FOUND
      );
    }

    this.modInfo.set(moduleCode, plainToInstance(ModInfoDto, res.data));
    return this.modInfo.get(moduleCode);
  }
}
