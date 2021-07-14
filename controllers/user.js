const User = require("../models/user");
const Team = require('../models/team')
const Subscribers = require('../models/subscribers');
const message = require('../utills/messages');
const { mailFn } = require('../utills/mail');
const { mailTestFn } = require('../utills/mail-test');
const { validationResult } = require('express-validator');
const { successAction, failAction } = require('../utills/response');
const { generateRandom } = require('../utills/tokens');
var ejs = require("ejs");
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
        ejs.renderFile("public/notify.ejs", function (err, data) {
            mailFn({
                to: req.body.email,
                subject: message.notify,
                html: data
            })
        })

        res.json(successAction(context, 'Successfully'))
    })
}

// User request Campus Ambassador && Admin verify Campus Ambassador
exports.campusAmbassador = async (req, res) => {
    let payload;
    let caid;
    if (req.user.role != 2) {
        if (await User.findOne({ _id: req.user._id }, { campusAmbassador: 1, _id: 0 }) != '{}') {
            return res.send(failAction('Already registered'))
        }
        caid = req.user._id
        payload = { campusAmbassador: { refCode: generateRandom(5), isVerified: false, isActive: 1 } }
    } else {
        delete req.body['refCode'];

        //  Admin can delete suspend and verify 
        payload = { campusAmbassador: req.body };
        caid = req.body._id
    }
    User.findOneAndUpdate(
        { _id: caid },
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


// Campus Ambassador List for Super Admin

exports.campusAmbassadorListAdmin = async (req, res) => {
    if (req.user.role == 2) {
        User.find({ "campusAmbassador.isActive": { $lt: 3 } }, { campusAmbassador: 1, name: 1, email: 1, userId: 1, isVerified: 1, isProfileComplete: 1, role: 1 }, (err, user) => {
            res.send(successAction(user))
        })
    } else {
        res.send(failAction('You are not Super admin'))
    }
}

exports.campusAmbassadorList = async (req, res) => {
    User.find({ "campusAmbassador.isVerified": true }, { campusAmbassador: 1, name: 1, email: 1, userId: 1, isVerified: 1, isProfileComplete: 1, role: 1 }, (err, user) => {
        res.send(successAction(user))
    })
}


// Create Team 
exports.createTeam = async (req, res) => {
    let { totalTeamMember, teamMembers, eventId } = req.body
    let teamLeader = req.user._id;
    let teamLeaderData = await User.findById({ _id: teamLeader })
    if (!teamLeaderData.hasPaidEntry) {
        return res.send(failAction('Please pay you entry Fee'))
    }

    let allUserData = await User.find({ userId: { $in: teamMembers } })
    let eventData = await Team.find({ eventId: eventId })
    let notPaid = [];
    let getId = [];
    let alreadyRegInEvent = [];
    allUserData.forEach(element => {
        // Check If user is Paid or not
        if (!element.hasPaidEntry) {
            notPaid.push(element.name)
        }

        // Check If User already registerd in Other team of same evenet
        eventData.find(({ usersId }) => {
            if (usersId.find(({ userId }) => { userId.toString() === element._id.toString() })?.userId) {
                console.log('User as a User');
                alreadyRegInEvent.push(element.name)
            }
        })

        // check If User already register as Leader
        if (eventData.find(({ leaderId }) => leaderId.toString() === element._id.toString())) {
            console.log('User as a Leader');
            alreadyRegInEvent.push(element.name)
        }

        getId.push({ userId: element._id })
    });

    // Check If leader is already register as User
    eventData.find(({ usersId }) => {
        if (usersId.find(({ userId }) => { userId.toString() === teamLeader.toString() })) {
            console.log('Team Leader as a User');
            alreadyRegInEvent.push(element.name)
        }
    })

    if (notPaid.length || alreadyRegInEvent.length) {
        return res.send(failAction({
            notPaid,
            alreadyRegInEvent
        }))
    }

    let payload = req.body;
    delete payload["usersId"]
    payload = {
        ...payload, ...{
            leaderId: req.user._id,
            usersId: getId
        }
    }
    // console.log(payload);
    const team = new Team(payload);

    team.save((err, team) => {
        if (err) {
            console.log(err);
            return res.status(400).json(
                failAction("Some error ocuured")
            )
        }
        res.send(team);
    })
}

exports.testMessage = (req, res) => {
    ejs.renderFile("public/notify.ejs", function (err, data) {
        mailFn({
            to: req.body.email,
            subject: message.notify,
            html: data
        })
        res.send('Message Sent')
    })
}


////////// workshop related

exports.enrollUserinWorkshop = (req, res) => {
    let workshops = [req.workshop1._id];
    // console.log(req.profile.workshopsEnrolled)
    // console.log(req.workshop1._id)
    var flag = 0
    req.profile.workshopsEnrolled.find(ele => {
        if (ele.equals(req.workshop1._id)) {
            flag = 1
            console.log('hoi')
        } else {
            console.log('jdahg')
        }

    })
    if (flag == 1) {
        return res.status(400).json({
            error: "Already registered"
        })
    }

    // store this in db
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { workshopsEnrolled: workshops } },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "Unable to enroll in workshop"
                });
            }
            return res.status(200).json(user)

        }
    );
}










