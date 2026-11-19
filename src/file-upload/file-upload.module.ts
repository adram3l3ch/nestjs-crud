import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { memoryStorage } from 'multer';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';
import { File } from './entities/file.entity.js';
import { FileUploadController } from './file-upload.controller.js';
import { FileUploadService } from './file-upload.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    CloudinaryModule,
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
