import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-ptage.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TOP_PAGE_NOT_FOUND_BY_ALIAS_ERROR, TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';


@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageServices: TopPageService) {
  }
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageServices.create(dto)
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
  const topPage = await this.topPageServices.findById(id)
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR)
    }
    return topPage
  }
  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string){
    const topPage = await this.topPageServices.findByAlias(alias);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_BY_ALIAS_ERROR)
    }
    return topPage
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id:string) {
    const topPage = await this.topPageServices.deleteById(id)
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR)
    }
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id', IdValidationPipe) id: string, @Body() dto: TopPageModel) {
    const topPage = await  this.topPageServices.updateById(id, dto);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return topPage
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
     return  this.topPageServices.findByCategory(dto);
  }

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
      return this.topPageServices.findByText(text)
  }
}
