import { Request, Response, NextFunction } from "express";
import { findUserById } from "../services/user.service";
import { createPost, findPostById, findPosts } from "../services/post.service";
import multer from "multer";
import AppError from "../utils/appError";
  
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: multerStorage,
});

export const uploadPostImage = upload.single('image')

export const resetValue = (req: Request, res:Response, next: NextFunction) => {
    if(req.file)
        req.body.image = req.file.filename
    
    next()
}

export const createPostHandler = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {        
        const user = await findUserById(res.locals.userId)

        const post = await createPost(req.body, user!)
    
        res.status(201).json({
            status: 'success',
            data: {
              post,
            },
        });
    } catch (err: any) {
        if(err.code == '23505'){
            return res.status(409).json({
                status: 'fail',
                message: 'Post with that title already exist',
            });
        }
        next(err);
    }
}

export const getPostsHandler = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {title, content} = req.query
        let whereClause = {}
        if(title as string)
          whereClause = {...whereClause, title}
        if(content as string)
          whereClause = {...whereClause, content}
        
        const posts = await findPosts(whereClause, {}, {});
    
        res.status(200).json({
          status: 'success',
          results: posts.length,
          data: {
            posts,
          },
        });
    } catch (err: any) {
        next(err);
    }
}

export const getPostHandler = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const post = await findPostById(req.params.postId);
    
        if (!post) {
          return next(new AppError(404, 'Post with that ID not found'));
        }
    
        res.status(200).json({
          status: 'success',
          data: {
            post,
          },
        });
      } catch (err: any) {
        next(err);
      }
}

export const updatePostHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const post = await findPostById(req.params.postId)

        if (!post) {
            return next(new AppError(404, 'Post with that ID not found'));
        }

        Object.assign(post, req.body);
        const updatedPost = await post.save();
        
        res.status(200).json({
            status: "SUCCESS",
            data: {
                post: updatedPost,
            }
        })
    } catch (err: any) {
        next(err)
    }
}

export const deletePostHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const post = await findPostById(req.params.postId);
  
      if (!post) {
        return next(new AppError(404, 'Post with that ID not found'));
      }
  
      await post.remove();
  
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err: any) {
      next(err);
    }
}