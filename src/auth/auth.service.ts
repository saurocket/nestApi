import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { hash, compare, genSalt } from 'bcryptjs';
import { USER_NOT_FOUND, WRONG_PASSWORD } from './atuh.constants';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModal: ModelType<UserModel>,
    private readonly jwtService:JwtService
              ) {
  }

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.userModal({
      email: dto.login,
      passwordHash:await hash(dto.password, salt)
    })
   return  newUser.save()
  }

  async  findUser(email: string) {
    return this.userModal.findOne({email}).exec()
  }

  async deleteUser(id: string):Promise<DocumentType<UserModel> | null> {
    return this.userModal.findByIdAndDelete(id).exec()
  }

  async getAllUsers():Promise<DocumentType<UserModel>[]> {
    return this.userModal.find().exec();
  }

  async validateUser(email:string, password: string):Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);
    if(!user) {
       throw new UnauthorizedException(USER_NOT_FOUND);
    }
    const isCorrectPassword  = await compare(password, user.passwordHash);

    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD)
    }
    return {email: user.email}
  }

  async login(email: string) {
    const payload = {email}
    return {
      access_token:await this.jwtService.signAsync(payload)
    };
  }

}
