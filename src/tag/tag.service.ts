import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TagEntity[]> {
    return await this.prisma.tag.findMany();
  }
}
