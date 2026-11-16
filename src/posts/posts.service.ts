import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { Post } from './entities/post.entity.js';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return this.postRepository.save(createPostDto);
  }

  async findAll(search = '') {
    return this.postRepository.find({ where: { title: search } });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException(`No post with the ID ${id}`);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.postRepository.delete(id);
    return 'Deleted Successfully';
  }
}
