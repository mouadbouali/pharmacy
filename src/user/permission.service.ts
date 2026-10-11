import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";

@Injectable()
export class PermissionService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createPermissionDto: CreatePermissionDto) {
        return this.databaseService.permission.create({
            data: {
                ...createPermissionDto
            }
        });
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto) {
        return this.databaseService.permission.update({
            where: {
                id: id
            },
            data: {
                ...updatePermissionDto
            }
        });
    }

    async findAll() {
        return this.databaseService.permission.findMany();
    }

    async findNamesForUser(userId: number): Promise<string[]> {
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
            select: {
                roles: {
                    select: {
                        permissions: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        return user?.roles.flatMap((role) =>
            role.permissions.map((permission) => permission.name),
        ) ?? [];
    }

    async delete(id: number) {
        return this.databaseService.permission.delete({
            where: {
                id: id
            }
        });
    }
}