import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateDto, UserResponseDto } from 'src/dto/user.dto';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: UserCreateDto): Promise<UserResponseDto> {
    const result = await this.prisma.user.create(request.create);
    return UserResponseDto.fromPrismaResult(result);
  }

  async find(user_id: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id: user_id },
    });
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
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

  private readonly users = [
    {
      password: 'changeme',
      userId: 1,
      username: 'john',
    },
    {
      password: 'guess',
      userId: 2,
      username: 'maria',
    },
  ];
}
