import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import config from 'src/config';

@Injectable()
export class FlagApi {
  private baseURL: string;

  constructor(private readonly httpService: HttpService) {
    this.baseURL = config.flagApiURL;
  }

  async get(endpoint: string, params = {}) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseURL}${endpoint}`, { params }),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.response) {
      throw new HttpException(error.response.data, error.response.status);
    } else {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
