import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RoleService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createRoleDto: CreateRoleDto) {
        return this.databaseService.role.create({
            data: {
                ...createRoleDto
            }
        });
    }

    async update(id: number, updateRoleDto: UpdateRoleDto) {
        return this.databaseService.role.update({
            where: {
                id: id
            },
            data: {
                ...updateRoleDto
            }
        });
    }

    async findAll() {
        return this.databaseService.role.findMany();
    }

    async delete(id: number) {
        return this.databaseService.role.delete({
            where: {
                id: id
            }
        });
    }
}