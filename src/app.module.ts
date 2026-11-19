import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { User } from './auth/entities/user.entity.js';
import { File } from './file-upload/entities/file.entity.js';
import { FileUploadModule } from './file-upload/file-upload.module.js';
import { Post } from './posts/entities/post.entity.js';
import { PostsModule } from './posts/posts.module.js';
import { EventsModule } from './events/events.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Abcd@123',
      database: 'nestjs-crud',
      entities: [Post, User, File],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 6000, limit: 5 }]),
    CacheModule.register({ isGlobal: true, ttl: 30000, max: 100 }),
    PostsModule,
    AuthModule,
    FileUploadModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
