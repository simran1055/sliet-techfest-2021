import User from "../models/user"
import Subscribers from '../models/subscribers'
import message from '../utills/messages'
import { mailFn } from '../utills/mail';
import { validationResult } from "express-validator";
import { successAction, failAction } from "../utills/response"

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Error while fetching user"
            })
        }

        req.profile = user
        next();
    })
}

exports.getUser = (req, res) => {
    req.profile.salt = undefined
    req.profile.encryPassword = undefined
    return res.json(req.profile)
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        {
            $set: req.body
        }, { new: true, useFindAndModify: false },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to update this user"
                })
            }

            user.salt = undefined;
            user.encryPassword = undefined;
            res.json(user)
        }
    )
}

exports.notify = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    if (await Subscribers.findOne({ email: req.body.email })) return res.status(400).json(failAction('Email is already registerd for notification'));

    const subscriber = new Subscribers(req.body);

    subscriber.save((err, subscriber) => {
        if (err) {
            return res.status(400).json(
                failAction("Some error ocuured")
            )
        }
        let context = {
            email: req.body.email,
        };

        console.log('hello');
        mailFn({
            to: req.body.email,
            subject: message.notify,
            html: `Hey there,
            Thanks for subscribing to techFEST'21 updates. You've been added to the official mailing list of techFEST, SLIET. 
            You'll be hearing from us soon. Follow our social media handles to know more.
            
            Regards,
            techFEST, SLIET
            `
        })

        res.json(successAction(context, 'Successfully'))
    })

}
