import { Prisma } from "src/generated/prisma/client";
import { ApiProperty  } from "@nestjs/swagger";

export class CreateUserDto implements Prisma.UserCreateInput{
    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    password: string;
}
