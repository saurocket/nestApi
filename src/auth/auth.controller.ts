import {
  BadRequestException,
  Body,
  Controller,
  Delete, Get,
  HttpCode, HttpException, HttpStatus, Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_EXIST_ERROR, USER_NOT_FOUNT_ERROR } from './atuh.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_EXIST_ERROR);
    }
    return this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() {login, password}: AuthDto) {
    const { email } = await this.authService.validateUser(login, password);
    return this.authService.login(email)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleteUser = await this.authService.deleteUser(id);
    if (!deleteUser) {
      throw new HttpException(USER_NOT_FOUNT_ERROR, HttpStatus.NOT_FOUND);
    }
    return deleteUser;
  }

  @Get()
  async get() {
    return this.authService.getAllUsers();
  }


}
