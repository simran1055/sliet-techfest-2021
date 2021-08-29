const User = require("../models/user");
const Team = require('../models/team')
const Subscribers = require('../models/subscribers');
const message = require('../utills/messages');
const { mailFn } = require('../utills/mail');
const { mailTestFn } = require('../utills/mail-test');
const { validationResult } = require('express-validator');
const { successAction, failAction } = require('../utills/response');
const { generateRandom } = require('../utills/tokens');
const uuidv4 = require('uuid');
const excel = require('exceljs');
const moment = require('moment')
var ejs = require("ejs");
const { verify } = require("./auth");

exports.getUserById = (req, res, next, id) => {
    User.findById(id).populate('workshopsEnrolled').populate('eventRegIn').exec((err, user) => {
        // console.log("user")
        if (err || !user) {
            return res.status(400).json({
                error: "Error while fetching user"
            })
        }
        req.profile = user

        next();
    })
}

exports.getUserId = (req, res) => {
    User.findOne(
        { email: req.body.email },
        { userId: 1, _id: 0, name: 1, isVerified: 1, isProfileComplete: 1, hasPaidEntry: 1, eventRegIn: 1 }, (err, user) => {
            // console.log(user);
            if (!user || err) {
                return res.send(failAction('User Not Found'))
            }
            // console.log('>>> event Id ', req.body.eventId);
            // console.log('>>>> eventRegIn ', user.eventRegIn);
            let inEvent = user.eventRegIn.find(x => x == req.body.eventId)

            if (inEvent) {
                return res.send(failAction('User Already registerd in Event'))
            }
            if (!user.isVerified) {
                return res.send(failAction('User Is Not Verified'))
            } if (!user.isProfileComplete) {
                return res.send(failAction('User Profile Is Not Complete'))
            } if (!user.hasPaidEntry) {
                return res.send(failAction('User has not paid entry fee'))
            }
            res.send(successAction({ name: user.name, userId: user.userId }))
        }
    )
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

    const { name,
        lastName,
        email,
        phone,
        dob,
        designation,
        collegeName,
        collegeAddress,
        courseEnrolled,
        branchOfStudy,
        yearOfStudy,
        whatsappPhoneNumber,
        telegramPhoneNumber } = req.body

    if (

        !phone || !dob || !designation
        || !collegeName
        || !collegeAddress
        || !courseEnrolled
        || !branchOfStudy
        || !yearOfStudy
        || !whatsappPhoneNumber
        || !telegramPhoneNumber
    ) {
        req.body['isProfileComplete'] = 0;
    } else {
        req.body['isProfileComplete'] = 1;
    }



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


exports.createTeam = async (req, res) => {
    let {
        totalTeamMember,
        teamMembers,
        eventId,
        teamLeader
    } = req.body
    let leaderId = req.user._id;

    // let alreadyInEvent = [];
    // let notPaidFee = [];
    // let email = [];
    // let getId = [];
    // let updateId = []

    if (totalTeamMember < teamMembers.length) {
        return res.send(failAction('Number of Team members are more then total team meambers'))
    }

    let leaderData = await User.findOne({ userId: teamLeader })

    if (!leaderData) {
        return res.send(failAction('User Not Found'))
    }
    let inEvent = leaderData.eventRegIn.find(x => x == eventId)
    if (inEvent) {
        return res.send(failAction('You are already registerd in Event'))
    }

    let allUser = await User.find({ userId: { $in: teamMembers } })
    let getId = [];
    let email = [];
    let alreadyReg = false;
    let notPaid = false
    allUser.forEach(element => {
        let inEvent = element.eventRegIn.find(x => x == eventId)
        if (alreadyReg || notPaid) {
            return
        }
        if (inEvent) {
            alreadyReg = true;
            return res.send(failAction(`${element.name} is already registerd in Event`))
        }
        if (!element.hasPaidEntry) {
            notPaid = true;
            return res.send(failAction(`${element.name} has not paid`))
        }
        let uuIdCode = uuidv4.v4()
        let x = {
            userId: element._id,
            inviteCode: uuIdCode,
        }
        if (leaderData._id.toString() == element._id.toString()) {
            x = {
                ...x, ...{ isAccepted: true }
            }
        }
        getId.push(x)

        if (leaderData._id.toString() != element._id.toString()) {
            email.push({
                email: element.email,
                name: element.name,
                confirm_link: "https://techfestsliet.com/?id=" + element._id + "&code=" + uuIdCode + "&event=" + eventId
            })
        }
    });

    if (alreadyReg || notPaid) {
        return
    }
    let payload = req.body;
    delete payload["usersId"]
    payload = {
        ...payload, ...{
            leaderId: req.user._id,
            usersId: getId
        }
    }

    const team = new Team(payload);
    // res.send(team)
    team.save((err, team) => {
        if (err) {
            // console.log(err);
            return res.status(400).json(
                failAction("Some error ocuured")
            )
        }
        res.send(team);
    })
    let updates = await User.findOneAndUpdate(
        { userId: teamLeader },
        { $push: { eventRegIn: eventId } },
        { new: true, useFindAndModify: false })

    email.forEach(element => {
        ejs.renderFile("public/testVerification.ejs", { payload: element }, function (err, data) {
            mailFn({
                to: element.email,
                subject: 'Invitation To Join Team',
                html: data
            })
        })
    });
}

exports.teamList = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    const { eventId, id } = req.body;

    let payload = {
        $or: [
            { eventId, "usersId.userId": id, "usersId.isAccepted": true },
            { eventId, leaderId: id }
        ]
    }
    let populateData = { name: 1, email: 1, userId: 1, phone: 1 }
    let checkUser = await Team.findOne(payload, { 'usersId.inviteCode': 0 }).populate('leaderId', populateData).populate('usersId.userId', populateData)
    res.send(checkUser)
}

// Accept Team Link 
exports.acceptTeamLink = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const { code, id, eventId } = req.body;

    console.log('>>', code, '>>', id, '>>', eventId);
    let checkUser = await Team.findOne({ eventId, "usersId.userId": id, "usersId.inviteCode": code })
    // return;
    if (!checkUser) {
        return res.send(failAction('User Not Found'))
    }

    await User.findOneAndUpdate({ _id: id }, { $addToSet: { eventRegIn: eventId } })

    Team.findOneAndUpdate(
        { eventId, "usersId.userId": id, "usersId.inviteCode": code },
        { $set: { "usersId.$.isAccepted": true } },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (!user || err) {
                return res.status(400).json(failAction('Something went wrong'))
            }
            return res.json(successAction('', 'verify Success'))
        }
    )
}

// Remove Team Member
exports.removeTeamMember = async (req, res) => {
    let { userToRemove, eventId } = req.body
    let userId = req.user._id
    console.log(userId);
    // return
    // let userRemoveBy = userToRemove
    let userToRemove1 = await User.findOne({ userId: userToRemove })
    Team.findOne({ eventId, "usersId.userId": userToRemove1._id }, (err, user) => {
        if (err || !user) {
            return res.send(failAction('User Not Found'))
        }
        if (userId == user.leaderId || userId == userToRemove) {
            User.findOneAndUpdate(
                { "_id": userToRemove },
                { $pull: { "eventRegIn": eventId } },
                { new: true, useFindAndModify: false },
                (err, user) => {
                    if (err) {
                        return res.status(400).json(failAction('Something went wrong'))
                    }
                    if (!user) {
                        return res.status(400).json(failAction('Something went wrong'))
                    }
                    Team.findOneAndUpdate(
                        { eventId, "usersId.userId": userToRemove },
                        { $pull: { "usersId": { userId: userToRemove } } },
                        { new: true, useFindAndModify: false },
                        (err, user) => {
                            if (err) {
                                return res.status(400).json(failAction('Something went wrong'))
                            }
                            if (!user) {
                                return res.status(400).json(failAction('Something went wrong'))
                            }
                            return res.json(successAction('', 'User Left the Team'))
                        }
                    )
                }
            )
        } else {
            return res.send(failAction('You cant remove this user from Team'))
        }

    })
}

exports.updateTeam = async (req, res) => {
    let { teamMembers, totalTeamMember, eventId } = req.body;
    let updateId = [];
    let getId = [];
    let email = [];
    let payload = req.body;
    let notPaid = false;
    Team.findOne({ eventId, leaderId: req.user._id }, (err, user) => {
        if (err || !user) {
            return res.send(failAction('User Not Found'))
        }
        // if ((teamMembers.length && (teamMembers.length == user.totalTeamMember || teamMembers.length > user.totalTeamMember))) {
        //     return
        // }

        User.find({ userId: { $in: teamMembers } }, (err, usersData) => {
            alreadyReg = false
            usersData.forEach(element => {
                let inEvent = element.eventRegIn.find(x => x == eventId)
                if (alreadyReg || notPaid) {
                    return
                }
                if (inEvent) {
                    alreadyReg = true;
                    return res.send(failAction(`${element.name} is already registerd in Event`))
                }
                if (!element.hasPaidEntry) {
                    notPaid = true;
                    return res.send(failAction(`${element.name} has not paid`))
                }
                let uuIdCode = uuidv4.v4()
                updateId.push(element._id)
                getId.push({
                    userId: element._id,
                    inviteCode: uuIdCode
                })
                email.push({
                    email: element.email,
                    name: element.name,
                    confirm_link: "https://techfestsliet.com/?id=" + element._id + "&code=" + uuIdCode + "&event=" + eventId
                })
            })
            if (alreadyReg || notPaid) {
                return;
            }
            email.forEach(element => {
                ejs.renderFile("public/testVerification.ejs", { payload: element }, function (err, data) {
                    mailFn({
                        to: element.email,
                        subject: 'Invitation To Join Team',
                        html: data
                    })
                })
            });

            delete payload["usersId"]
            payload = {
                ...payload, ...{
                    leaderId: req.user._id,
                    usersId: getId
                }
            }
            Team.findOneAndUpdate(
                { eventId, leaderId: req.user._id },
                { $set: payload },
                { new: true, useFindAndModify: false },
                (err, user) => {
                    if (err) {
                        return res.send(failAction('Something went wrong'))
                    }
                    res.send(successAction("Invitation Email Sent to New Team Meamber"))
                }
            )

            // User.updateMany(
            //     { _id: { $in: updateId } },
            //     { $push: { eventRegIn: eventId } },
            //     { new: true, useFindAndModify: false },
            //     (err, user) => {
            //         if (err) {
            //             return res.send(failAction('Something went wrong'))
            //         }
            //         res.send(user)
            //     }
            // )
        })
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
            // console.log('hoi')
        } else {
            // console.log('jdahg')
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
            user.salt = undefined;
            user.encryPassword = undefined;
            return res.status(200).json(user)

        }
    );
}


exports.enrollUserinEvent = (req, res) => {
    let events = [req.event1._id];
    // console.log(req.profile)
    // console.log(req.workshop1)
    var flag = 0
    req.profile.eventRegIn.find(ele => {
        if (ele.equals(req.event1._id)) {
            flag = 1
            // console.log('hoi')
        } else {
            // console.log('jdahg')
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
        { $push: { eventRegIn: events } },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "Unable to enroll in Event"
                });
            }
            user.salt = undefined;
            user.encryPassword = undefined;
            return res.status(200).json(user)

        }
    );
}


// excel Sheet 
exports.studentRegIn = async (req, res) => {
    let id = req.params.id;
    let type = req.params.type;
    if (type == 'event') {
        type = 'eventRegIn';
    } else {
        type = 'workshopsEnrolled';
    }
    let filter = {
        userId: 1, name: 1, lastName: 1, email: 1, phone: 1, collegeName: 1, designation: 1, regNo: 1, branchOfStudy: 1, yearOfStudy: 1, _id: 0
    }

    let data = await User.find({ [type]: { $all: [id] } }, filter)

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('User');
    worksheet.columns = [
        { header: 'User ID', key: 'userId', width: 10 },
        { header: 'Name', key: 'name', width: 10 },
        { header: 'Last Name', key: 'lastName', width: 10 },
        { header: 'Email', key: 'email', width: 10 },
        { header: 'Phone', key: 'phone', width: 10 },
        { header: 'College Name', key: 'collegeName', width: 10 },
        { header: 'Designation', key: 'designation', width: 10 },
        { header: 'Reg No', key: 'regNo', width: 10 },
        { header: 'Branch Of Study', key: 'branchOfStudy', width: 10 },
        { header: 'Year Of Study', key: 'yearOfStudy', width: 10 },
    ]

    data.forEach(element => {
        worksheet.addRow(element);
    })
    worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true }
    })
    // const WBS = await workbook.xlsx.writeFile('Users.xlsx')
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "user-list.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}

exports.eventData = async (req, res) => {
    let { eventId } = req.params;
    console.log(eventId);
    let leaderData = await Team.find({ eventId }).populate('leaderId', { name: 1, email: 1, hasPaidEntry: 1, userId: 1, phone: 1, yearOfStudy: 1, regNo: 1 }).populate('usersId.userId', { name: 1, email: 1, hasPaidEntry: 1, userId: 1, phone: 1, yearOfStudy: 1, regNo: 1 });

    let data = []

    leaderData.forEach(element => {
       let payload = {}
        payload = {
            "Leader Name": element.leaderId.name,
            "Leader Email": element.leaderId.email,
            "Leader Pay": element.leaderId.hasPaidEntry,
            "Leader Phone": element.leaderId.phone,
            "Leader Year Of Study": element.leaderId.yearOfStudy,
        }
        element.usersId.forEach((element, index) => {  
            payload = {
                ...payload,
                ...{
                    ['User Name ' + (index + 1)]: element.userId.name,
                    ['Wser Eamil ' + (index + 1)]: element.userId.email,
                    ['User Phone ' + (index + 1)]: element.userId.phone,
                    ['User Paid ' + (index + 1)]: element.userId.hasPaidEntry,
                }
            }
        });
        data.push(payload)
    });

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('User');
    
    
    worksheet.columns = [
        // { header: 'User ID', key: 'userId', width: 10 },
        // { header: 'Name', key: 'name', width: 10 },
        // { header: 'Email', key: 'email', width: 10 },
        // { header: 'Phone', key: 'phone', width: 10 },
        // { header: 'Reg No', key: 'regNo', width: 10 },
        // { header: 'Year Of Study', key: 'yearOfStudy', width: 10 },
        { header: "Leader Name", key: 'Leader Name', height: 10 },
        { header: "Leader Email", key: 'Leader Email', height: 10 },
        { header: "Leader Pay", key: 'Leader Pay', height: 10 },
        { header: "Leader Phone", key: 'Leader Phone', height: 10 },
        { header: "Leader year Of Study", key: 'Leader year Of Study', height: 10 },
        // { header: "User Name 1", key: 'User Name 1', height: 10 },
        // { header: "User Email 1", key: 'User Email 1', height: 10 },
        // { header: "User Phone 1", key: 'User Phone 1', height: 10 },
        // { header: "User Paid 1", key: 'User Paid 1', height: 10 },
        { header: "User Name 1", key: 'User Name 1', height: 10 },
        { header: "User Email 1", key: 'User Email 1', height: 10 },
        { header: "User Phone 1", key: 'User Phone 1', height: 10 },        
        { header: "User Paid 1", key: 'User Paid 1', height: 10 },
        { header: "User Name 2", key: 'User Name 2', height: 10 },
        { header: "User Email 2", key: 'User Email 2', height: 10 },
        { header: "User Phone 2", key: 'User Phone 2', height: 10 },
        { header: "User Paid 2", key: 'User Paid 2', height: 10 },
        { header: "User Name 3", key: 'User Name 3', height: 10 },
        { header: "User Email 3", key: 'User Email 3', height: 10 },
        { header: "User Phone 3", key: 'User Phone 3', height: 10 },
        { header: "User Paid 3", key: 'User Paid 3', height: 10 },
        { header: "User Name 4", key: 'User Name 4', height: 10 },
        { header: "User Email 4", key: 'User Email 4', height: 10 },
        { header: "User Phone 4", key: 'User Phone 4', height: 10 },
        { header: "User Paid 4", key: 'User Paid 4', height: 10 },
        { header: "User Name 5", key: 'User Name 5', height: 10 },
        { header: "User Email 5", key: 'User Email 5', height: 10 },
        { header: "User Phone 5", key: 'User Phone 5', height: 10 },
        { header: "User Paid 5", key: 'User Paid 5', height: 10 },
    ]
    data.forEach(element => {
        worksheet.addRow(element);
    })
    worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true }
    })
    // const WBS = await workbook.xlsx.writeFile('Users.xlsx')
    //   res.send(data)
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "user-list.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}

exports.allStudentData = async (req, res) => {
    let data = await User.find({}, { userId: 1, name: 1, lastName: 1, email: 1, phone: 1, collegeName: 1, designation: 1, regNo: 1, branchOfStudy: 1, yearOfStudy: 1, _id: 0 }).populate('workshopsEnrolled', { workshopName: 1, _id: 0 }).populate('eventRegIn', { eventName: 1, _id: 0 })

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('User');
    worksheet.columns = [
        { header: 'User ID', key: 'userId', width: 10 },
        { header: 'Name', key: 'name', width: 10 },
        { header: 'Last Name', key: 'lastName', width: 10 },
        { header: 'Email', key: 'email', width: 10 },
        { header: 'Phone', key: 'phone', width: 10 },
        { header: 'College Name', key: 'collegeName', width: 10 },
        { header: 'Designation', key: 'designation', width: 10 },
        { header: 'Reg No', key: 'regNo', width: 10 },
        { header: 'Branch Of Study', key: 'branchOfStudy', width: 10 },
        { header: 'Year Of Study', key: 'yearOfStudy', width: 10 },
        { header: 'Event Enrolled', key: 'eventRegIn', width: 10 },
        { header: 'Workshops Enrolled', key: 'workshopsEnrolled', width: 10 },
    ]

    data.forEach(element => {
        worksheet.addRow(element);
    })
    worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true }
    })
    const WBS = await workbook.xlsx.writeFile('Users.xlsx')
    console.log(WBS);
    res.send(data)
}