import { Request, Response, NextFunction } from "express";
import { 
    createPackage,
    findPackageById,
    findPackages 
} from "../services/package.service";
import AppError from "../utils/appError";

export const createPackageHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const createdPackage = await createPackage(req.body)

        res.status(201).json({
            status: 'success',
            data: {
            package: createdPackage,
            },
        });
    } catch (err: any) {
        next(err)
    }
}

export const getPackagesHandler = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const related_packages = await findPackages({}, {}, {})

        res.status(200).json({
            status: 'success',
            data: {
            package: related_packages,
            },
        });
    } catch (err: any) {
        next(err)
    }
}

export const getPackageHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const related_package = await findPackageById(req.params.packageId)

        if(!related_package)
            return next(new AppError(404, 'Package with that ID not found'));

        res.status(200).json({
            status: 'success',
            data: {
            package: related_package,
            },
        });
    } catch (err: any) {
        next(err)
    }
}

export const updatePackageHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const related_package = await findPackageById(req.params.packageId)

        if(!related_package)
            return next(new AppError(404, 'Package with that ID not found'));

        Object.assign(related_package, req.body)
        const updated_package = related_package.save()

        res.status(200).json({
            status: 'success',
            data: {
            package: updated_package,
            },
        });
    } catch (err: any) {
        next(err)
    }
}

export const deletePackageHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const related_package = await findPackageById(req.params.packageId)

        if(!related_package)
            return next(new AppError(404, 'Package with that ID not found'));

        await related_package.remove()

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err: any) {
        next(err)
    }
}