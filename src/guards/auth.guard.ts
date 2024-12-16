import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as process from 'node:process';

@Injectable()
export class JwtAuth implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new Error('No token provided');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('Malformed authorization header');
        }

        try {
            const secret = process.env.JWT_SECRET || 'superKeyScurize';

            console.log('Using Secret:', secret);
            console.log('Token:', token);

            const decoded = jwt.verify(token, secret);
            console.log('Decoded Token:', decoded);

            request.user = decoded;
            return true;
        } catch (err) {
            console.error('JWT Verification Error:', err.message);
            throw new Error(err.message);
        }
    }
}