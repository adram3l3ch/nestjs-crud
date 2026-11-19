import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity.js';
import { CloudinaryService } from './cloudinary/cloudinary.service.js';
import { File } from './entities/file.entity.js';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadFile(file: Express.Multer.File, user: User) {
    const { url, public_id } = await this.cloudinaryService.uploadFile(file);
    const newlyUploadedFile = this.fileRepository.create({
      url,
      uploader: user,
      size: file.size,
      mimeType: file.mimetype,
      originalName: file.originalname,
      publicId: public_id,
    });

    return this.fileRepository.save(newlyUploadedFile);
  }

  async findAll() {
    return this.fileRepository.find({
      relations: { uploader: true },
      order: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    const fileToBeDeleted = await this.fileRepository.findOneBy({ id });

    if (!fileToBeDeleted)
      throw new NotFoundException(`File with id ${id} not found`);

    await this.cloudinaryService.deleteFile(fileToBeDeleted.publicId);
    return this.fileRepository.remove(fileToBeDeleted);
  }
}
