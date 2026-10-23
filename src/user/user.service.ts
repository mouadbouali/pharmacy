import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    return this.databaseService.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hash,
      },
    });
  }

  async updateUserRoles(id: number, roles: number[]) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        roles: {
          set: roles.map((roleId) => ({ id: roleId })),
        },
      },
    });
  }

  /* async update(id: number, updateUserDto: UpdateUserDto) {
    const hash = await bcrypt.hash(updateUserDto.password || '', 10);
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.name,
        password: hash
      },
    });
  }

  async findAll() {
    return this.databaseService.user.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id
      },
    });
  } */

  async findByEmail(email: string) {
    return this.databaseService.user.findUnique({
      where: {
        email
      },
    });
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id
      },
    });
  }

  /* async remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  } */

  async validateCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    return ok ? user : null;
  }
}