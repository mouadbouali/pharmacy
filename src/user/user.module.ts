import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PermissionService } from './permission.service';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PermissionController } from './permission.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, RoleController, PermissionController],
  providers: [UserService, RoleService, PermissionService],
  exports: [UserService, RoleService, PermissionService],
})
export class UserModule {}
