import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Bcrypt from 'bcryptjs';
import * as JWT from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserType } from './types/user.type';
import { IUserResponse } from './types/user-response.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserType> {
    const isUserExist = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (isUserExist) {
      throw new HttpException(
        'Email already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const hashPassword = await this.generateHashPassword(
      createUserDto.password,
    );
    const newUser = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
        hashPassword,
      },
    });
    delete newUser.hashPassword;
    return newUser;
  }

  async generateHashPassword(password: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10);
    const hashPassword = await Bcrypt.hash(password, salt);
    return hashPassword;
  }

  generateJwt(user: UserType): string {
    return JWT.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      this.config.get('JWT_SECRET'),
    );
  }

  buildUserResponse(user: UserType): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
