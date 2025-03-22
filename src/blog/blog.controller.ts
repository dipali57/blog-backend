import {
  Controller,
  Res,
  HttpStatus,
  Post,
  Body,
  NotFoundException,
  Param,
  Get,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDTO } from './dtos/create-post.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';
import { Response } from 'express';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  //submit a post
  @Post('/post')
  async addPost(@Res() res: Response, @Body() createPostDTO: CreatePostDTO) {
    try {
      const newPost = await this.blogService.addPost(createPostDTO);
      return res.status(HttpStatus.CREATED).json({
        message: 'Post has been submitted successfully!',
        post: newPost,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: `Error: post not created due to ${err}`,
        error: 'Bad Request',
      });
    }
  }

  //Fetch a particular post using ID
  @Get('post/:postID')
  async getPost(
    @Res() res: Response,
    @Param('postID', new ValidateObjectId()) postID,
  ) {
    const post = await this.blogService.getPost(postID);
    if (!post) {
      throw new NotFoundException('Post does not exist!');
    }
    return res.status(HttpStatus.OK).json(post);
  }

  //fetch all post

  @Get('posts')
  async getPosts(@Res() res: Response) {
    const posts = await this.blogService.getAllPost();
    return res.status(HttpStatus.OK).json(posts);
  }

  @Put('/edit')
  async editPost(
    @Res() res: Response,
    @Query('postID', new ValidateObjectId()) postID,
    @Body() createPostDTO: CreatePostDTO,
  ) {
    const editedPost = await this.blogService.editPost(postID, createPostDTO);
    if (!editedPost) {
      throw new NotFoundException('Post does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Post has been successfully updated',
    });
  }
  // Delete a post using ID
  @Delete('/delete')
  async deletePost(
    @Res() res: Response,
    @Query('postID', new ValidateObjectId()) postID,
  ) {
    const deletedPost = await this.blogService.deletePost(postID);
    if (!deletedPost) {
      throw new NotFoundException('Post does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Post has been deleted!',
      post: deletedPost,
    });
  }
}
