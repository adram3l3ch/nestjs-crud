import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { Like, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { FindPostsQueryDto } from './dto/find-posts-query.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { Post } from './entities/post.entity.js';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface.js';

@Injectable()
export class PostsService {
  private postListCacheKeys: Set<string> = new Set();

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    await this.invalidatePostsListCache();
    return this.postRepository.save({ ...createPostDto, authorName: author });
  }

  async findAll(filters: FindPostsQueryDto): Promise<PaginatedResponse<Post>> {
    const { page = 1, limit = 10, search = '' } = filters;
    const postListCacheKey = this.generatePostListCacheKey(filters);

    this.postListCacheKeys.add(postListCacheKey);

    const cachedData =
      await this.cacheManager.get<PaginatedResponse<Post>>(postListCacheKey);

    if (cachedData) return cachedData;

    const [posts, total] = await this.postRepository.findAndCount({
      where: { title: Like(`%${search}%`) },
      relations: { authorName: true },
      order: { createdAt: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<Post> = {
      items: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    this.cacheManager.set(postListCacheKey, response, 30000);
    return response;
  }

  async findOne(id: number) {
    const cacheKey = `post_${id}`;

    const cachedData = await this.cacheManager.get<Post>(cacheKey);
    if (cachedData) return cachedData;

    const post = await this.postRepository.findOne({
      where: { id },
      relations: { authorName: true },
    });

    if (!post) throw new NotFoundException(`No post with the ID ${id}`);
    this.cacheManager.set(cacheKey, post, 30000);
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

    await this.cacheManager.del(`post_${id}`);
    await this.invalidatePostsListCache();
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.postRepository.delete(id);
    await this.cacheManager.del(`post_${id}`);
    await this.invalidatePostsListCache();
    return 'Deleted Successfully';
  }

  private async invalidatePostsListCache() {
    for (const key of this.postListCacheKeys) {
      await this.cacheManager.del(key);
    }
    this.postListCacheKeys.clear();
  }

  private generatePostListCacheKey(query: FindPostsQueryDto) {
    const { limit = 10, page = 1, search = 'all' } = query;
    return `posts_list_page${page}_limit${limit}_search${search}`;
  }
}
