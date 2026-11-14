import { OmitType } from '@nestjs/mapped-types';
import { Post } from '../entities/post.entity.js';

export class CreatePostDto extends OmitType(Post, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
