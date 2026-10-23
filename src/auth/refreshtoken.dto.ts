import { IsString, Matches } from "class-validator";

export class RefreshTokenDto {
    @IsString()
    @Matches(/^[a-fA-F0-9]{64}$/)
    token: string;
}