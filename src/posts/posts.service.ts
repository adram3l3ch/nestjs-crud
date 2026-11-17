import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { Post } from './entities/post.entity.js';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    return this.postRepository.save({ ...createPostDto, authorName: author });
  }

  async findAll(search = '') {
    return this.postRepository.find({
      where: { title: Like(`%${search}%`) },
      relations: { authorName: true },
    });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: { authorName: true },
    });
    if (!post) throw new NotFoundException(`No post with the ID ${id}`);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, author: User) {
    const postToUpdate = await this.findOne(id);

    if (postToUpdate?.authorName.id !== author.id) {
      throw new UnauthorizedException('You can only update your own posts');
    }

    await this.postRepository.update(id, {
      ...updatePostDto,
      authorName: author,
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.postRepository.delete(id);
    return 'Deleted Successfully';
  }
}
