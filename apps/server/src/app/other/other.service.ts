import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OtherService {
  constructor(
    private readonly httpService: HttpService,
  ) {
  }

  async getRandomMaleName(): Promise<string> {
    const { data: [name] } = await firstValueFrom(this.httpService.get(
      'http://names.drycodes.com/1?nameOptions=boy_names',
    ));
    const [firstName] = name.split('_');
    return firstName;
  }
}
