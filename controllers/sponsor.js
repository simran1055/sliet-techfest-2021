import Sponsors from "../models/sponsors"
import message from '../utills/messages'
import { mailFn } from '../utills/mail';
import { validationResult } from "express-validator";
import { successAction, failAction } from "../utills/response"
import { v4 as uuidv4 } from 'uuid';

// Add Sponsor
export const addSponsor = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(failAction(errors.array()[0].msg))
    }
    if (await Sponsors.findOne({ orgEmail: req.body.orgEmail })) {
        return res.status(400).json(failAction('Email is already registerd'));
    }
    if (await Sponsors.findOne({ orgName: req.body.orgName })) {
        return res.status(400).json(failAction('Name is already registerd'));
    }
    let payload = {
        ...req.body, ...{
            verificationCode: uuidv4()
        }
    }

    const sponsor = new Sponsors(payload);
    sponsor.save((err, sponsor) => {
        if (err) {
            console.log(err);
            return res.status(400).json(
                failAction("Not able to Sign Up. Some error ocuured")
            )
        }

        res.status(200).json(
            successAction({
                name: sponsor.orgName,
                email: sponsor.orgEmail,
                id: sponsor.id
            })
        )

        mailFn({
            to: req.body.orgEmail,
            subject: message.verificaton,
            html: `<h1>Thanks for Sponsor ${sponsor.orgName}</h1>
            <p> <a href="https://sliet.movieshunters.com?vf=${sponsor.verificationCode}?id=${sponsor.id}"> Please Click here to verify </a></p>
        `
        })
    })
}

// All Sponsor List
export const sponsorsList = async (req, res) => {
    Sponsors.find({}, { isVerifiedByAdmin: ture }, (err, sponsor) => {
        if (err) {
            return res.status(400).json(
                failAction("Something happend, try again later.")
            )
        }
        res.send(successAction(sponsor))
    })
}

// update profile
export const profileUpdate = async (req, res) => {
    // let sponsor = await Sponsors.findOne({ _id: req.body._id })
    // if (!sponsor) {
    //     return res.status(400).json(failAction('sponsor is not regstered'));
    // }
    Sponsors.findByIdAndUpdate(
        { _id: req.body._id },
        {
            $set: req.body
        }, { new: true, useFindAndModify: false },
        (err, sponsor) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to update this user"
                })
            }
            res.json(successAction(sponsor))
        }
    )
}
