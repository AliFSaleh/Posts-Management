import express from 'express'
import {
    createPostHandler,
    getPostsHandler,
    getPostHandler,
    updatePostHandler,
    resetValue,
    uploadPostImage,
    deletePostHandler
} from '../controllers/posts.controller'
import { deserializeUser } from '../middlewares/deserializeUser';
import { createPostSchema } from '../schemas/post.schema';
import { validate } from '../middlewares/validate';

const router = express.Router()

router.use(deserializeUser);

router.route('/')
        .post(uploadPostImage, resetValue, validate(createPostSchema), createPostHandler)
        .get(getPostsHandler)

router.route('/:postId')
        .get(getPostHandler)
        .patch(updatePostHandler)
        .delete(deletePostHandler)

export default router