import { MongooseModule } from '@nestjs/mongoose';

export const configMongoConnection = MongooseModule.forRoot(
  process.env.MONGODB_CONNECTION_STRING.toString(),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
);
