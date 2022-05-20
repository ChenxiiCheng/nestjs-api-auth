import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';
import { ExpressRequest } from 'src/types/express-request.interface';
import { IUserResponse } from 'src/user/types/user-response.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decode = JWT.verify(
        token,
        this.config.get('JWT_SECRET'),
      ) as IUserResponse & { id: number };
      const user = await this.userService.findUserById(decode.id);
      req.user = user;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
