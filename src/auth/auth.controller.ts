import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  Response,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request as Req, Response as Res } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: AuthDto, @Response({ passthrough: true }) res: Res) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/register')
  async register(
    @Body() dto: AuthDto,
    @Response({ passthrough: true }) res: Res,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @HttpCode(200)
  @Post('/login/access-token')
  async getNewTokens(
    @Request() req: Req,
    @Response({ passthrough: true }) res: Res,
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenToResponse(res);
      throw new UnauthorizedException('No refresh token');
    }

    const { refreshToken, ...user } = await this.authService.getNewTokens(
      refreshTokenFromCookies,
    );

    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return user;
  }

  @HttpCode(200)
  @Post('/logout')
  async logout(@Response({ passthrough: true }) res: Res) {
    this.authService.removeRefreshTokenToResponse(res);
    return true;
  }
}
