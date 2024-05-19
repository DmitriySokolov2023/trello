import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}
  async login(dto: AuthDto) {
    const { password, ...user } = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);

    return {
      user,
      accessToken: tokens[0],
      refreshToken: tokens[1],
    };
  }
  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email);
    if (oldUser) throw new BadRequestException('User already exists');
    if (!oldUser) {
      await this.userService.create(dto);
      const user = await this.prismaService.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      const tokens = this.issueTokens(user.id);
      return {
        user,
        accessToken: tokens[0],
        refreshToken: tokens[1],
      };
    }
  }

  private issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return [accessToken, refreshToken];
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new NotFoundException('Invalid password');

    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }
  removeRefreshTokenToResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }

  async getNewTokens(refreshTokenFromCookie: string) {
    const result = await this.jwt.verifyAsync(refreshTokenFromCookie);
    if (!result) throw new UnauthorizedException('Invalid refresh token');
    const { password, ...user } = await this.userService.getById(result.id);
    const tokens = this.issueTokens(user.id);

    return {
      user,
      accessToken: tokens[0],
      refreshToken: tokens[1],
    };
  }
}
