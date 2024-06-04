import {z, object ,string} from 'zod'

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

export const updatePostSchema = object({
    body: object({
        title: string(),
        content: string(),
        image: string()
    }).partial()
})