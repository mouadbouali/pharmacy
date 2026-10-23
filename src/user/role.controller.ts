import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { AuthGuard } from "@nestjs/passport";
import { PermissionGuard } from "src/auth/permission.guard";
import { Permissions } from "src/auth/permission.decorator";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('ROLE_CREATE')
    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    findAll() {
        return this.roleService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('ROLE_UPDATE')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(+id, updateRoleDto);
    }

    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('ROLE_DELETE')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.roleService.delete(+id);
    }

    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('ROLE_UPDATE')
    @Put(':id/permissions')
    updateRolePermissions(@Param('id') id: number, @Body() permissions: number[]){
    return this.roleService.updateRolePermissions(id, permissions);
    }
}