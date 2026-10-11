import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "src/generated/prisma/client";

export class CreatePermissionDto implements Prisma.PermissionCreateInput {
    @ApiProperty()
    name: string;
}