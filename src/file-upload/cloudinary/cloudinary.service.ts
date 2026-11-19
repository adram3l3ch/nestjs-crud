import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary: typeof v2) {}

  uploadFile(file: Express.Multer.File) {
    return new Promise<UploadApiResponse>((res, rej) => {
      console.log(file);
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder: 'nestjs-crud', resource_type: 'auto' },
        (error, result) => {
          if (error) rej(error);
          res(result!);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string) {
    return this.cloudinary.uploader.destroy(publicId);
  }
}
