import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './interfaces/blog.interface';
import { CreatePostDTO } from './dtos/create-post.dto';
@Injectable()
export class BlogService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async addPost(createPostDTO: CreatePostDTO): Promise<Post> {
    const newPost = new this.postModel(createPostDTO);
    return newPost.save();
  }

  async getPost(postID): Promise<Post> {
    const post = await this.postModel.findById(postID).exec();
    if (!post) {
      throw new NotFoundException(`post ${postID} not found`);
    }
    return post;
  }

  async getAllPost(): Promise<Post[]> {
    const posts = await this.postModel.find().exec();
    return posts;
  }

  async editPost(postID, createPostDTO: CreatePostDTO): Promise<Post> {
    const editedPost = await this.postModel.findByIdAndUpdate(
      postID,
      createPostDTO,
      { new: true },
    );
    if (!editedPost) {
      throw new NotFoundException(`Post ${postID} not found`);
    }

    return editedPost;
  }

  async deletePost(postID) {
    const deletedPost = await this.postModel.findByIdAndDelete(postID);
    if (!deletedPost) {
      throw new NotFoundException(`post ${postID} not found`);
    }
    return deletedPost;
  }
}
