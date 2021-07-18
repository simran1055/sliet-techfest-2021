const Event = require('../models/events');
const { successAction, failAction } = require("../utills/response")
const formidable = require("formidable");
const fs = require("fs")
const path = require("path")
const _ = require("lodash");
const { uploadFileFunc } = require("../utills/fileupload.js")

exports.getEventById = (req, res, next, id) => {
    Event.findById(id).populate('eventCoordinator').populate('teamRef').populate('domainRefId').exec((err, event1) => {
        if (err || !event1) {
            return res.status(400).json({
                error: "Error while fetching Event"
            })
        }

        req.event1 = event1
        next();
    })
}

exports.createEvent = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json(failAction("problem with something in form "))
        }

        // const { eventName,
        //     domainRefId,
        //     startDate,
        //     endDate,
        //     participantCountMax,
        //     participantCountMin,
        //     evnetLink
        // } = fields;

        // if (!eventName || !eventDescription || !studentCoordinator || !facultyCoordinator) {
        //     // fs.unlinkSync(newPath);
        //     return res.status(400).json({
        //         error: "Please include all the fields"
        //     });
        // }


        let eventCoordinatorArray = fields.eventCoordinator.split(",");


        fields.eventCoordinator = eventCoordinatorArray

        let event1 = new Event(fields);


        if (file.photo) {




            ///TODO: check file type


            var fur = uploadFileFunc(file);

            if (fur.error) {
                return res.status(400).json({
                    error: fur.error
                })
            }

            var newPath1 = fur;
            var newPath = 'upload/' + newPath1


        }
        event1.photo = newPath1;
        event1.save((err, event1) => {
            if (err) {

                try {
                    fs.unlinkSync(newPath);
                } catch (err) {
                    console.log("file not found")
                }
                return res.status(400).json({
                    // error: "event not saved in db, some error occured"
                    error: err
                })
            }

            res.json({
                message: "event added successfully",
                event1
            })
        })





    })
}

exports.getEvent = (req, res) => {
    // req.event1.photo = undefined;
    return res.json(req.event1)
}

//middleware
exports.photo = (req, res, next) => {
    if (req.event1.photo) {
        // res.set("Content-Type", req.event1.photo.contentType);
        return res.send(req.event1.photo);
    }
    next();
};
////////
exports.getAllEvents = (req, res) => {
    // let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    // let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Event.find().populate('eventCoordinator').populate('teamRef').populate('domainRefId').exec((err, events) => {
        if (err) {
            return res.status(400).json({
                error: "No Event Found"
            });
        }
        res.json(events);
    });
}

exports.updateEvent = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {

        if (err) {
            return res.status(400).json({
                error: "Some problem whith form"
            });
        }

        //updation
        let event1 = req.event1;




        event1 = _.extend(event1, fields);


        if (fields.eventCoordinator) {
            let eventCoordinatorArray = fields.eventCoordinator.split(",");
            event1.eventCoordinator = eventCoordinatorArray
        }
        //  else {
        //     event1.depopulate("studentCoordinator")
        // }

        // if (facultyCoordinator) {
        //     let facultyCoordinatorArray = facultyCoordinator.split(",");
        //     event1.facultyCoordinator = facultyCoordinatorArray
        // }
        // else {
        //     event1.depopulate("facultyCoordinator")
        // }

        //handle file here
        if (file.photo) {
            try {
                fs.unlinkSync(event1.photo);
            } catch (err) {
                console.log("file not found")
            }



            var fur = uploadFileFunc(file);

            if (fur.error) {
                return res.status(400).json({
                    error: fur.error
                })
            }

            var newPath1 = fur;
            var newPath = 'upload/' + newPath1


            event1.photo = newPath1;

        }

        // //save to db

        event1.save((err, event1) => {
            if (err) {
                try {
                    fs.unlinkSync(newPath);
                } catch (err) {
                    console.log("file not found")
                }

                res.status(400).json({
                    error: "updating event in DB failed!!"
                });
            }
            res.json({
                message: "event updated successfully",
                event1
            })
        });
    });
}

exports.deleteEvent = (req, res) => {
    let event1 = req.event1;
    event1.remove((err, deletedEvent) => {
        if (err) {
            return res.status(400).json(
                failAction(" Event not found")
            )
        }

        try {
            fs.unlinkSync(deletedEvent.photo);
        } catch (err) {
            console.log("file not found")
        }
        res.json({
            message: "Deleted Successfully",
            deletedEvent
        })
    })
}



// const Event = require('../models/events')
// const { successAction, failAction } = require("../utills/response")


// // todo add photo
// exports.createEvent = (req, res) => {
//     let payload = req.body;

//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;

//     form.parse(req, (err, fields, file) => {
//         if (err) {
//             return res.status(400).json(failAction("problem with something in form "))
//         }
//         fields = {
//             ...fields, ...{
//                 eventCreatedBy: req.user._id
//             }
//         }

//         if (file.photo) {

//             var fur = uploadFileFunc(file);

//             if (fur.error) {
//                 return res.status(400).json({
//                     error: fur.error
//                 })
//             }

//             var newPath1 = fur;
//             var newPath = 'upload/' + newPath1

//         }
//         fields.photo = newPath1;
//         let event = new Event(payload);
//         event.save((err, event) => {
//             if (err) {
//                 try {
//                     fs.unlinkSync(newPath);
//                 } catch (err) {
//                     console.log("file not found")
//                 }
//                 return res.send(failAction('Some error accoured'))
//             }
//             res.send(successAction(event, "Event Added Successfully"))
//         })
//     })

//     // payload = {
//     //     ...payload, ...{
//     //         eventCreatedBy: req.user._id
//     //     }
//     // }

// }

// exports.updateEvent = async (req, res) => {

//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;
//     form.parse(req, (err, fields, file) => {
//         if (file.photo) {
//             try {
//                 fs.unlinkSync(domain1.photo);
//             } catch (err) {
//                 console.log("file not found")
//             }



//             var fur = uploadFileFunc(file);

//             if (fur.error) {
//                 return res.status(400).json({
//                     error: fur.error
//                 })
//             }

//             var newPath1 = fur;
//             var newPath = 'upload/' + newPath1


//             domain1.photo = newPath1;

//         }
//         Event.findOneAndUpdate(
//             {
//                 _id: req.body._id
//             },
//             {
//                 $set: fields
//             },
//             (err, event) => {
//                 if (err) {
//                     return res.send(failAction('Some error accoured'))
//                 }
//                 res.send(successAction(event, 'Update Successfully'))
//             })
//     })


//     // let isEvent = await Event.findOne({ _id: req.body._id });
//     // if (!isEvent) {
//     //     return res.send(failAction('No Event Found'))
//     // }

//     // // Must be same User or Super admin that is '2'

//     // if (!(isEvent.eventCreatedBy == req.user._id || req.user.role == 2)) {
//     //     return res.send(failAction('You are not authorized to update this event'))
//     // }
//     // if (req.user.role != 2) {
//     //     delete req.body['isActive'];
//     // }


//     Event.findOneAndUpdate(
//         {
//             _id: req.body._id
//         },
//         {
//             $set: req.body
//         },
//         (err, event) => {
//             if (err) {
//                 return res.send(failAction('Some error accoured'))
//             }
//             res.send(successAction(event, 'Update Successfully'))
//         })
// }

// exports.deleteEvent = async (req, res) => {
//     let isEvent = await Event.findOne({ _id: req.body._id });
//     if (!isEvent) {
//         return res.send(failAction('No Event Found'))
//     }

//     // Must be same User or Super admin that is '2'
//     if (!(isEvent.eventCreatedBy == req.user._id || req.user.role == 2)) {
//         return res.send(failAction('You are not authorized to update this event'))
//     }
//     Event.findOneAndUpdate({
//         _id: req.body._id
//     },
//         {
//             $set: { isActive: 3 }
//         },
//         (err, event) => {
//             if (err) {
//                 return res.send(failAction('Some error accoured'))
//             }
//             res.send(successAction(event, 'Update Successfully'))
//         })
// }


// exports.eventListAdmin = (req, res) => {
//     if (req.user.role != 2) {
//         return res.send(failAction('You are not authorized to update this event'))
//     }
//     let payload = {
//         // Super admin can see all Events Except Deleted.
//         isActive: { $lt: 3 }
//     };
//     Event.find(payload, (err, event) => {
//         if (err) {
//             return res.send(failAction('Some error accoured'))
//         }
//         res.send(successAction(event))
//     })
// }

// exports.eventList = (req, res) => {
//     let payload = {
//         // User can only see approved Events
//         isApproved: true
//     };
//     Event.find(payload, (err, event) => {
//         if (err) {
//             return res.send(failAction('Some error accoured'))
//         }
//         res.send(successAction(event))
//     })
// }


// exports.getEvent = (req, res) => {
//     let payload = {
//         // User can only see approved Events
//         _id: req.body._id,
//         isApproved: true
//     };
//     Event.find(payload, (err, event) => {
//         if (err) {
//             return res.send(failAction('Some error accoured'))
//         }
//         res.send(successAction(event))
//     })
// }

// exports.eventVerify = (req, res) => {
//     if (req.user.role != 2) {
//         return res.send(failAction('You are not authorized to update this event'))
//     }
//     Event.findOneAndUpdate(
//         {
//             _id: req.body._id
//         },
//         {
//             $set: { isApproved: true }
//         }, (err, event) => {
//             if (err) {
//                 return res.send(failAction('Some error accoured'))
//             }
//             res.send(successAction(event))
//         })
// }


