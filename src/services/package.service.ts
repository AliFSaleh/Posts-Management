import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { Package } from "../entities/package.entity";
import { AppDataSource } from "../utils/data-source";

const packageRepository = AppDataSource.getRepository(Package)


export const createPackage = async (input: Partial<Package>) => {
    return await packageRepository.save(packageRepository.create({...input}))
}

export const findPackageById = async (packageId: string) => {
    return await packageRepository.findOneBy({id: packageId})
}

export const findPackages = async (
    where: FindOptionsWhere<Package>= {},
    select: FindOptionsSelect<Package>= {},
    relations: FindOptionsRelations<Package>= {}
) => {
    return await packageRepository.find({
        where,
        select,
        relations
    })
}