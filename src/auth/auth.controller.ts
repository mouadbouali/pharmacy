import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { RefreshTokenDto } from "./refreshtoken.dto";

@Controller("Auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard("local"))
    @Post("login")
    login(@Request() req){
        return this.authService.login(req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post("logout")
    logout(@Request() req) {
        return this.authService.logout(req.user.userId);
    }

    @Post("refresh")
    refreshToken(@Body() refreshToken: RefreshTokenDto) {
        return this.authService.refreshToken(refreshToken);
    }
}
