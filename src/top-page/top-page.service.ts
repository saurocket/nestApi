import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopPageModel } from './top-page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-ptage.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {
  }

  async create(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(id);
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias });
  }


  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id);
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async findByCategory({ firstLevelCategory }: FindTopPageDto) {
    return this.topPageModel.aggregate()
      .match({ firstLevelCategory })
      .group({
        _id: { secondCategory: '$secondCategory' },
        pages: { $push: { alias: '$alias', title: '$title' } },
      });
  }

  async findByText(text: string) {
    return this.topPageModel.find({
      $text: {
        $search: text,
        $caseSensitive: false,
      },
    });
  }

}
