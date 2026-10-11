import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "src/generated/prisma/client";

export class CreateRoleDto implements Prisma.RoleCreateInput {
    @ApiProperty()
    name: string;
}