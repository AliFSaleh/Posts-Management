import { Request, Response, NextFunction } from "express";
import { 
    createPackage,
    findPackageById,
    findPackages 
} from "../services/package.service";
import AppError from "../utils/appError";
import { findUserById } from "../services/user.service";
import { AppDataSource } from "../utils/data-source";
import { Subscription } from "../entities/subscription.entity";
import Stripe from "stripe";
import { createPackageInput, createSessionInput } from "../schemas/package.schema";

const stripe_secret_key = process.env.STRIPE_SECRET as string
const subscription_repository = AppDataSource.getRepository(Subscription)


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

export const createSessionHandler = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = res.locals.userId as string
    const packageId = req.body.packageId as string

    const user = await findUserById({id: userId})
    const selectedPackage = await findPackageById(packageId)
    if(!user){
        return next(new AppError(404, 'User Not found'));
    }
    if(!selectedPackage){
        return next(new AppError(404, 'Package with that ID not found'));
    }

    const stripe = new Stripe(stripe_secret_key)
    const description = `Now you can be active ${selectedPackage.days} days`    


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        metadata: {
            userId: user.id,
        },
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: selectedPackage.title,
                description: description,
              },
              unit_amount: selectedPackage.price * 100, // Price in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel', 
    });

    res.status(200).json({
        status: 'SUCCESS',
        data:{
            session
        }
    })
}

export const webhookHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {


    console.log('wwwwwwweeeeeebbbbbbbbhhhhhhhhooooooooccccckkkkkkkk');
    console.log('222222222222222222222222222222222222222222222222222222');
    
    
    // const sig = req.headers['stripe-signature'];
    // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Replace with your webhook secret
    // const stripe = new Stripe(stripe_secret_key)

    // let event;

    // try {
    //     event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret!);
    // } catch (err: any) {
    //     console.error('Webhook error:', err);
    //     res.status(400).send(`Webhook Error: ${err.message}`);
    //     return;
    // }

    // if (event.type === 'checkout.session.completed') {
    //     const subscription = event.data.object.subscription;

    //     // Access subscription details and complete subscription operation for user
    //     // console.log('Subscription created! Subscription ID:', subscription.id);
    //     // Update user account or database based on subscription details

    //     res.sendStatus(200);
    // } else {
    //     console.warn('Unhandled Stripe webhook event:', event.type);
    //     res.sendStatus(200); // Acknowledge Stripe regardless of event type
    // }
}







export const subscribePackageHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = await findUserById(res.locals.userId)
    const related_package = await findPackageById(req.body.packageId)
    if(!user){
        return next(new AppError(404, 'User Not found'));
    }
    if(!related_package){
        return next(new AppError(404, 'Package with that ID not found'));
    }

    const milliseconds = Date.now();

    const start_date = new Date(milliseconds);
    
    const year = start_date.getFullYear();
    const month = start_date.getMonth() + 1;
    const day = start_date.getDate();
    
    const start_date_format = `${year}-${month}-${day}`;

    const milliseconds_2 = Date.now();
    const end_date = new Date(milliseconds_2);

    end_date.setDate(end_date.getDate() + 30);

    const year_end = end_date.getFullYear();
    const month_end = end_date.getMonth() + 1;
    const day_end = end_date.getDate();

    const end_date_format = `${year_end}-${month_end}-${day_end}`;   

    const created_subscription = await subscription_repository.save(subscription_repository.create({
        user_id: user.id,
        package_id: related_package.id,
        start_date: start_date_format,
        end_date: end_date_format
    })) 

    res.status(200).json({
        status: "SUCCESS",
        data: {
            created_subscription
        }
    })
}

export const getMySubscriptions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = await findUserById(res.locals.userId)

    let whereObject = {}
    let relationObject = ['package']
    
    if(user!.role == 'user') {
        whereObject = {...whereObject, user_id: user!.id}
    } else {
        relationObject.push('user')
    }

    const subscriptions = await subscription_repository.find({
        where: whereObject,
        relations: relationObject,
    });

    res.status(200).json({
        status: "SUCCESS",
        data: {
            subscriptions
        }
    })
}