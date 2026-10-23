import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import { RefreshTokenDto } from './refreshtoken.dto';

@Injectable()
export class AuthService {

    constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly db: DatabaseService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.validateCredentials(email, password);
    if (!user) throw new UnauthorizedException();
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    const refreshToken = randomBytes(32).toString("hex");
    await this.db.refreshToken.create({
      data: {
        userId: user.id,
        token: createHash('sha256').update(refreshToken).digest('hex'),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    });
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: refreshToken
    };
  }

  async logout(userId: number) {
    await this.db.refreshToken.deleteMany({
      where: {
        userId: userId
      }
    });
  }

  async refreshToken(token: RefreshTokenDto) {
    const storedToken = await this.db.refreshToken.findUnique({
      where: {
        token: createHash('sha256').update(token.token).digest('hex')
      }
    });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne(storedToken.userId);
    if (!user) throw new UnauthorizedException();
    const result = await this.db.$transaction(async (tx) => {
      const now = new Date();
      const deletedToken = await tx.refreshToken.deleteMany({
        where: {
          id: storedToken.id,
          token: createHash('sha256').update(token.token).digest('hex'),
          expiresAt: {gt: now}
        }
      });
      if (deletedToken.count !== 1) throw new UnauthorizedException();
      const newRefreshToken = randomBytes(32).toString('hex');
      await tx.refreshToken.create({
        data: {
          userId: user.id,
          token: createHash('sha256').update(newRefreshToken).digest('hex'),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      return {
        access_token: await this.jwtService.signAsync({ sub: user.id, email: user.email }),
        refresh_token: newRefreshToken
      };
    });
    return result;
  }
}
