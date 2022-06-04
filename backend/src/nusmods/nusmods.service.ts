import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map, of } from 'rxjs';

const NUSMODS_API_URL = 'https://api.nusmods.com/v2';
const ACAD_YEAR = '2021-2022';

@Injectable()
export class NusmodsService {
  constructor(private httpService: HttpService) { }

  async getSummaries() {
    const moduleList = await lastValueFrom(this.httpService
      .get(`${NUSMODS_API_URL}/${ACAD_YEAR}/moduleList.json`)
      .pipe(map((res) => res.data)));

    return moduleList;
  }

  async getDetails() {
    const moduleList = await lastValueFrom(this.httpService
      .get(`${NUSMODS_API_URL}/${ACAD_YEAR}/moduleInfo.json`)
      .pipe(map((res) => res.data)));

    return moduleList;
  }

  async getModuleInfo(moduleCode: string) {
    const res = await lastValueFrom(this.httpService
      .get(`${NUSMODS_API_URL}/${ACAD_YEAR}/modules/${moduleCode}.json`)
      .pipe(catchError((err) => of(err.response))));

    if (res.status === HttpStatus.NOT_FOUND) {
      throw new HttpException(
        `Module ${moduleCode} does not exist`,
        HttpStatus.NOT_FOUND
      );
    }

    return res.data;
  }
}
