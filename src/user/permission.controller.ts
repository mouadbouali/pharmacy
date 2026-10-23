import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { AuthGuard } from "@nestjs/passport";
import { PermissionGuard } from "src/auth/permission.guard";
import { Permissions } from "src/auth/permission.decorator";

@Controller('permission')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('PERMISSION_CREATE')
    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    findAll() {
        return this.permissionService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('PERMISSION_UPDATE')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionService.update(+id, updatePermissionDto);
    }

    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('PERMISSION_DELETE')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.permissionService.delete(+id);
    }
}