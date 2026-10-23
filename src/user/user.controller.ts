import { Controller, Get, Post, Body, Request, UseGuards, Patch, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/permission.guard';
import { Permissions } from 'src/auth/permission.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Permissions('USER_CREATE')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Permissions('USER_UPDATE')
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Permissions('USER_UPDATE')
  @Put(':id/roles')
  updateUserRoles(@Param('id') id: number, @Body() roles: number[]){
    return this.userService.updateUserRoles(id, roles);
  }

/*   @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  } */

 /*  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  } */
}
