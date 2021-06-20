import Sponsors from "../models/sponsors"
import message from '../utills/messages'
import { mailFn } from '../utills/mail';
import { validationResult } from "express-validator";
import { successAction, failAction } from "../utills/response"

// Add Sponsor
export const addSponsor = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(failAction(errors.array()[0].msg))
    }
    if (await User.findOne({ orgEmail: req.body.email })) {
        return res.status(400).json(failAction('Email is already registerd'));
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

        mailFn({
            to: req.body.email,
            subject: message.verificaton,
            html: `<h1>Thanks for Sponsor ${sponsor.orgName}</h1>
            <p> <a href="https://sliet.movieshunters.com?vf=${sponsor.verificationCode}?id=${sponsor.id}"> Please Click here to verify </a></p>
        `
        })

        res.status(200).json(
            successAction({
                name: sponsor.orgName,
                email: sponsor.orgEmail,
                id: sponsor.id
            })
        )
    })
}

// All Sponsor List
export const sponsorsList = async (req, res) => {
    res.send(' this is list')

}