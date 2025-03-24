import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as process from 'node:process';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return null
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Malformed authorization header');
    }
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }
      request.user = jwt.verify(token, secret);
      return true;
    } catch (err) {
      console.error('JWT Verification Error:', err.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
