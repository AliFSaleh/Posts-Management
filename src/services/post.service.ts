import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm"
import { Post } from "../entities/posts.entity"
import { User } from "../entities/users.entity"
import { AppDataSource } from "../utils/data-source"

const postRepository = AppDataSource.getRepository(Post)

export const createPost = async (input: Partial<Post>, user: User) => {
    return await postRepository.save(postRepository.create({...input, user}))
}

export const findPostById = async (postId: string) => {
    return await postRepository.findOneBy({id: postId})
}

export const findPosts = async (
    where: FindOptionsWhere<Post> = {},
    select: FindOptionsSelect<Post> = {},
    relations: FindOptionsRelations<Post> = {}
  ) => {
    return await postRepository.find({
      where,
      select,
      relations,
    });
};