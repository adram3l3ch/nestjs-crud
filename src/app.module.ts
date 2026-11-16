import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { User } from './auth/entities/user.entity.js';
import { Post } from './posts/entities/post.entity.js';
import { PostsModule } from './posts/posts.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Abcd@123',
      database: 'nestjs-crud',
      entities: [Post, User],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
