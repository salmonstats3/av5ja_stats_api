import { Injectable } from '@nestjs/common';
import lodash from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateDto, UserResponseDto } from 'src/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: UserCreateDto): Promise<UserResponseDto> {
    const result = await this.prisma.user.create(request.create);
    return UserResponseDto.fromPrismaResult(result);
  }

  async find(user_id: string): Promise<UserResponseDto> {
    const result = lodash.omit(
      await this.prisma.user.findUniqueOrThrow({
        where: { id: user_id },
      }),
      ['sessionToken'],
    );
    return UserResponseDto.fromPrismaResult(result);
  }

  async find_all(): Promise<UserResponseDto[]> {
    const result = await this.prisma.user.findMany({
      select: {
        accounts: true,
        createdAt: true,
        id: true,
        name: true,
        sessionToken: false,
        updatedAt: true,
      },
    });
    return result.map(UserResponseDto.fromPrismaResult);
  }
}
