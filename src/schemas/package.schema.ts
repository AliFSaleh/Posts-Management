import { number, object, string, TypeOf } from "zod";

export const CreatePackageSchema = object({
    body: object({
        title: string({
            required_error: 'Title is required'
        }),

        days: number({
            required_error: "Days number is required"
        }),

        price: number({
            required_error: "Price is required"
        }),       
    })
})

export const updatePackageSchema = object({
    body: object({
        title: string(),
        days: number(),
        price: number()
    }).partial()
})

export type createPackageInput = TypeOf<typeof CreatePackageSchema>['body']