import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Sundargaan Backend is running! 🚀';
  }
}
