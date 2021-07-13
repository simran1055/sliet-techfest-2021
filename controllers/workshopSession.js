const WorkshopSession = require('../models/workshopSession');
const { successAction, failAction } = require("../utills/response")
const formidable = require("formidable");
const fs = require("fs")
const path = require("path")
const _ = require("lodash");
const { uploadFileFunc } = require("../utills/fileupload.js")
// Pad number 
function pad(number, length) {

    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}
exports.getWorkshopSessionById = (req, res, next, id) => {
    WorkshopSession.findById(id).populate('workshopId').exec((err, workshopSession1) => {
        if (err || !workshopSession1) {
            return res.status(400).json({
                error: "Error while fetching WorkshopSession"
            })
        }

        req.workshopSession1 = workshopSession1
        next();
    })
}

exports.createWorkshopSession = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, file) => {
        if (err) {
            return res.status(400).json(failAction("problem with something in form "))
        }

        const { dateTime,
            scheduledLink,

            workshopSessionName,
            workshopId
        } = fields;

        if (!dateTime || !scheduledLink || !workshopId || !workshopSessionName
        ) {
            // fs.unlinkSync(newPath);
            return res.status(400).json({
                error: "Please include all the fields"
            });
        }


        let count = await WorkshopSession.countDocuments();
        let workshopSessionId = '#TFWS' + pad(count + 1, 3).toString();
        let workshopSession1 = new WorkshopSession({
            dateTime,
            scheduledLink,
            workshopSessionId,

            workshopSessionName,
            workshopId
            // facultyCoordinator: facultyCoordinatorArray,
        });




        workshopSession1.save((err, workshopSession1) => {
            if (err) {
                return res.status(400).json({
                    // error: "workshopSession not saved in db, some error occured"
                    error: err
                })
            }

            res.json({
                message: "workshopSession added successfully",
                workshopSession1
            })
        })





    })
}

exports.getWorkshopSession = (req, res) => {
    // req.workshopSession1.photo = undefined;
    return res.json(req.workshopSession1)
}


exports.getAllWorkshopSessions = (req, res) => {
    // let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    // let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    WorkshopSession.find().populate('workshopId').exec((err, workshopSessions) => {
        if (err) {
            return res.status(400).json({
                error: "No WorkshopSession Found"
            });
        }
        res.json(workshopSessions);
    });
}

exports.updateWorkshopSession = (req, res) => {


    delete req.body['workshopSessionId'];

    WorkshopSession.findByIdAndUpdate(
        { _id: req.workshopSession1._id },
        {
            $set: req.body
        }, { new: true, useFindAndModify: false },
        (err, workshopSession) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to update workshopsession"
                })
            }

            res.json(workshopSession)
        }
    )




    // let form = new formidable.IncomingForm();
    // form.keepExtensions = true;
    // form.parse(req, (err, fields, file) => {

    //     if (err) {
    //         return res.status(400).json({
    //             error: "Some problem whith form"
    //         });
    //     }

    //     //updation
    //     let workshopSession1 = req.workshopSession1;

    //     const { workshopSessionName,
    //         workshopSessionDescription,
    //         studentCoordinator,
    //         // facultyCoordinator,
    //         hostName,
    //         hostDescription
    //     } = fields;



    //     workshopSession1 = _.extend(workshopSession1, fields);

    //     // console.log(facultyCoordinator)


    //     if (studentCoordinator) {
    //         let studentCoordinatorArray = studentCoordinator.split(",");
    //         workshopSession1.studentCoordinator = studentCoordinatorArray
    //     }
    //     //  else {
    //     //     workshopSession1.depopulate("studentCoordinator")
    //     // }

    //     // if (facultyCoordinator) {
    //     //     let facultyCoordinatorArray = facultyCoordinator.split(",");
    //     //     workshopSession1.facultyCoordinator = facultyCoordinatorArray
    //     // }
    //     // else {
    //     //     workshopSession1.depopulate("facultyCoordinator")
    //     // }

    //     //handle file here
    //     if (file.photo) {
    //         try {
    //             fs.unlinkSync(workshopSession1.photo);
    //         } catch (err) {
    //             console.log("file not found")
    //         }



    //         var fur = uploadFileFunc(file);

    //         if (fur.error) {
    //             return res.status(400).json({
    //                 error: fur.error
    //             })
    //         }

    //         var newPath1 = fur;
    //         var newPath = 'upload/' + newPath1


    //         workshopSession1.photo = newPath1;

    //     }

    //     // //save to db

    //     workshopSession1.save((err, workshopSession1) => {
    //         if (err) {
    //             try {
    //                 fs.unlinkSync(newPath);
    //             } catch (err) {
    //                 console.log("file not found")
    //             }

    //             res.status(400).json({
    //                 error: "updating workshopSession in DB failed!!"
    //             });
    //         }
    //         res.json({
    //             message: "workshopSession updated successfully",
    //             workshopSession1
    //         })
    //     });
    // });
}

exports.deleteWorkshopSession = (req, res) => {
    let workshopSession1 = req.workshopSession1;
    workshopSession1.remove((err, deletedWorkshopSession) => {
        if (err) {
            return res.status(400).json(
                failAction(" WorkshopSession not found")
            )
        }


        res.json({
            message: "Deleted Successfully",
            deletedWorkshopSession
        })
    })
}

