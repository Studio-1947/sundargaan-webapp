import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminTokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const configuredToken = this.configService.get<string>('ADMIN_API_TOKEN');

    if (!configuredToken) {
      throw new UnauthorizedException('Admin API token is not configured');
    }

    const authHeader = request.headers.authorization;
    const bearerToken =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : '';
    const headerToken = request.headers['x-admin-token'];
    const token =
      bearerToken ||
      (typeof headerToken === 'string' ? headerToken.trim() : '');

    if (!token || token !== configuredToken) {
      throw new UnauthorizedException('Invalid admin API token');
    }

    return true;
  }
}
