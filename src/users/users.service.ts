import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateDto, UserResponseDto } from 'src/dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: UserCreateDto): Promise<UserResponseDto> {
    const result = await this.prisma.user.create(request.create);
    return UserResponseDto.fromPrismaResult(result);
  }
}
