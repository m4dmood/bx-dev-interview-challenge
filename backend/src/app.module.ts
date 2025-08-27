import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import getCommonConfig from './configs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app/app.service';
import { FileService } from './services/file/file.service';
import { BucketService } from './services/bucket/bucket.service';
import { FileController } from './controllers/file/file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [getCommonConfig] }),
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'database.local',
        port: 5432,
        username: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        database: process.env.POSTGRES_DB!,
        entities: [FileEntity],
        synchronize: true,
        retryAttempts: 10,
        retryDelay: 3000,
      }),
      TypeOrmModule.forFeature([FileEntity])
  ],
  controllers: [AppController, FileController],
  providers: [AppService, FileService, BucketService],
  exports: [FileService, BucketService]
})
export class AppModule {}
