import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { ModDetailDto, ModInfoDto, ModSummaryDto } from './dto';

const NUSMODS_API_URL = 'https://api.nusmods.com/v2';
const ACAD_YEAR = '2021-2022';

@Injectable()
export class NusmodsService {
  constructor(private httpService: HttpService) { }

  async getSummaries(): Promise<ModSummaryDto[]> {
    const moduleList = await lastValueFrom(this.httpService
      .get(`${NUSMODS_API_URL}/${ACAD_YEAR}/moduleList.json`)
      .pipe(map((res) => res.data)));

    if (Array.isArray(moduleList)) {
      return moduleList.map((mod) => plainToInstance(ModSummaryDto, mod));
    } else {
      throw new HttpException(
        `Unable to retrieve module summaries`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getDetails(): Promise<ModDetailDto[]> {
    const moduleList = await lastValueFrom(this.httpService
      .get(`${NUSMODS_API_URL}/${ACAD_YEAR}/moduleInfo.json`)
      .pipe(map((res) => res.data)));

    if (Array.isArray(moduleList)) {
      return moduleList.map((mod) => plainToInstance(ModDetailDto, mod));
    } else {
      throw new HttpException(
        `Unable to retrieve module details`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getModuleInfo(moduleCode: string): Promise<ModInfoDto> {
    const res = await lastValueFrom(this.httpService
      .get(`${NUSMODS_API_URL}/${ACAD_YEAR}/modules/${moduleCode}.json`)
      .pipe(catchError((err) => of(err.response))));

    if (res.status === HttpStatus.NOT_FOUND) {
      throw new HttpException(
        `Module ${moduleCode} does not exist`,
        HttpStatus.NOT_FOUND
      );
    }

    return plainToInstance(ModInfoDto, res.data);
  }
}
