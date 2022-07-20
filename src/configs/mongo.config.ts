import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};

const getMongoString = (configService: ConfigService) =>
  `mongodb+srv://${configService.get('MONGO_LOGIN')}:${configService.get('MONGO_PASSWORD')}@cluster0.u5eep.mongodb.net/${configService.get('MONGO_AUTHDATABASE')}?retryWrites=true&w=majority`

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


