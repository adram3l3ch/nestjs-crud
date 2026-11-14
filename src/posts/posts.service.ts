import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { Post } from './entities/post.entity.js';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      authorName: 'adramelech',
      content: 'this is a post',
      createdAt: new Date(),
      id: 1,
      title: 'post title',
    },
    {
      authorName: 'adramelech',
      content: 'this is another post',
      createdAt: new Date(),
      id: 2,
      title: 'another post title',
    },
    {
      authorName: 'john doe',
      content: "this is john doe's post",
      createdAt: new Date(),
      id: 3,
      title: 'John doe post title',
    },
  ];

  create(createPostDto: CreatePostDto) {
    const newPost = {
      ...createPostDto,
      createdAt: new Date(),
      id: (this.posts.at(-1)?.id || 0) + 1,
    };

    this.posts.push(newPost);
    return newPost;
  }

  findAll(search = '') {
    const lowerCaseSearch = search.toLowerCase();

    return this.posts.filter((post) =>
      Object.values(post).some((v) =>
        String(v).toLowerCase().includes(lowerCaseSearch),
      ),
    );
  }

  findOne(id: number) {
    const post = this.posts.find((post) => post.id === id);
    if (!post) throw new NotFoundException(`No post with the ID ${id}`);
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    let updatedPost: Post | undefined;

    this.posts = this.posts.map((post) => {
      if (post.id !== id) return post;
      updatedPost = { ...post, ...updatePostDto, updatedAt: new Date() };
      return updatedPost;
    });

    if (!updatedPost) throw new NotFoundException(`No post with the ID ${id}`);

    return updatedPost;
  }

  remove(id: number) {
    let postFound = false;

    this.posts = this.posts.filter((post) => {
      const isItPostToBeDeleted = post.id === id;
      if (isItPostToBeDeleted) postFound = true;
      return !isItPostToBeDeleted;
    });

    if (!postFound) throw new NotFoundException(`No post with the ID ${id}`);

    return 'Deleted successfully';
  }
}
