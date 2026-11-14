import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PostsService } from '../posts.service.js';

@Injectable()
export class PostExistsPipe implements PipeTransform {
  constructor(private readonly postsService: PostsService) {}
  transform(id: number, metadata: ArgumentMetadata) {
    return this.postsService.findOne(id);
  }
}
