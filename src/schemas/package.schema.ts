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

const params = {
    params: object({
      packageId: string(),
    }),
};

export const updatePackageSchema = object({
    ...params,
    body: object({
        title: string(),
        days: number(),
        price: number()
    }).partial()
})

export const createSessionSchema = object({
    ...params
})

export type createPackageInput = TypeOf<typeof CreatePackageSchema>['body']
export type updatePackageInput = TypeOf<typeof updatePackageSchema>
export type createSessionInput = TypeOf<typeof createSessionSchema>