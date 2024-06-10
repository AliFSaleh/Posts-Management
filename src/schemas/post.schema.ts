import {z, object ,string, TypeOf} from 'zod'

export const createPostSchema = object({
    body: object({
        title: string({
            required_error: 'Title is required'
        }),

        content: string({
            required_error: 'Content is required'
        }),

        image: string({
            required_error: 'Image is required'
        })
    })
})

const params = {
    params: object({
      postId: string(),
    }),
};

export const updatePostSchema = object({
    ...params,
    body: object({
        title: string(),
        content: string(),
        image: string()
    }).partial()
})



export type CreatePostInput = TypeOf<typeof createPostSchema>['body'];
export type UpdatePostInput = TypeOf<typeof updatePostSchema>;
