const User = require("../models/user");
const Subscribers = require('../models/subscribers');
const message = require('../utills/messages');
const { mailFn } = require('../utills/mail');
const { validationResult } = require('express-validator');
const { successAction, failAction } = require('../utills/response');
const { generateRandom } = require('../utills/tokens')
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
    delete req.body['email'];
    delete req.body['role'];
    delete req.body['userId'];
    delete req.body['isProfileComplete'];
    delete req.body['isVerified'];
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

// User request Campus Ambassador && Admin verify Campus Ambassador
exports.campusAmbassador = async (req, res) => {
    let payload;
    if (req.user.role != 2) {
        if (await User.findOne({ _id: req.user._id }, { campusAmbassador: 1, _id: 0 }) != '{}') {
            return res.send(failAction('Already registered'))
        }
        payload = { campusAmbassador: { refCode: generateRandom(5), isVerified: false, isActive: 1 } }
    } else {
        delete req.body['refCode'];
        payload = { campusAmbassador: req.body };
    }
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $set: payload
        }, { new: true, useFindAndModify: false },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to update this user"
                })
            }
            res.send(successAction(user))
        }
    )
}