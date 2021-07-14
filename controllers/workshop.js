const Workshop = require('../models/workshop');
const { successAction, failAction } = require("../utills/response")
const formidable = require("formidable");
const fs = require("fs")
const path = require("path")
const _ = require("lodash");
const { uploadFileFunc } = require("../utills/fileupload.js");
const WorkshopSession = require('../models/workshopSession');

exports.getWorkshopById = (req, res, next, id) => {
    Workshop.findById(id).populate('studentCoordinator').exec((err, workshop1) => {
        if (err || !workshop1) {
            return res.status(400).json({
                error: "Error while fetching Workshop"
            })
        }


        // WorkshopSession.find({ workshopId: workshop1._id }).exec((err, workshopsessions) => {
        //     // console.log(workshopsessions)
        //     if (err || !workshopsessions) {
        //         return res.status(400).json({
        //             error: "Error while fetching Workshop"
        //         })
        //     }

        //     workshop1.sessions = workshopsessions
        //     console.log(workshop1)
        req.workshop1 = workshop1


        next();
        // })
        // req.workshop1.sessions = a;



    })




}

exports.createWorkshop = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json(failAction("problem with something in form "))
        }

        const { workshopName,
            workshopDescription,
            studentCoordinator,
            hostName,
            hostDescription
        } = fields;

        if (!workshopName || !workshopDescription || !studentCoordinator || !hostName ||
            !hostDescription) {
            // fs.unlinkSync(newPath);
            return res.status(400).json({
                error: "Please include all the fields"
            });
        }


        let studentCoordinatorArray = studentCoordinator.split(",");

        // let facultyCoordinatorArray = facultyCoordinator.split(",");



        let workshop1 = new Workshop({
            workshopName,
            workshopDescription,
            hostName,
            hostDescription,
            studentCoordinator: studentCoordinatorArray,
            // facultyCoordinator: facultyCoordinatorArray,
        });


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
        workshop1.photo = newPath1;
        workshop1.save((err, workshop1) => {
            if (err) {

                try {
                    fs.unlinkSync(newPath);
                } catch (err) {
                    console.log("file not found")
                }
                return res.status(400).json({
                    error: "workshop not saved in db, some error occured"
                    // error: er
                })
            }

            res.json({
                message: "workshop added successfully",
                workshop1
            })
        })





    })
}

exports.getWorkshop = (req, res) => {
    // req.workshop1.photo = undefined;
    return res.json(req.workshop1)
}

//middleware
exports.photo = (req, res, next) => {
    if (req.workshop1.photo) {
        // res.set("Content-Type", req.workshop1.photo.contentType);
        return res.send(req.workshop1.photo);
    }
    next();
};
////////
exports.getAllWorkshops = (req, res) => {
    // let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    // let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Workshop.find().populate('studentCoordinator').exec((err, workshops) => {
        if (err) {
            return res.status(400).json({
                error: "No Workshop Found"
            });
        }
        res.json(workshops);
    });
}

exports.updateWorkshop = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {

        if (err) {
            return res.status(400).json({
                error: "Some problem whith form"
            });
        }

        //updation
        let workshop1 = req.workshop1;

        const { workshopName,
            workshopDescription,
            studentCoordinator,
            // facultyCoordinator,
            hostName,
            hostDescription
        } = fields;



        workshop1 = _.extend(workshop1, fields);

        // console.log(facultyCoordinator)


        if (studentCoordinator) {
            let studentCoordinatorArray = studentCoordinator.split(",");
            workshop1.studentCoordinator = studentCoordinatorArray
        }
        //  else {
        //     workshop1.depopulate("studentCoordinator")
        // }

        // if (facultyCoordinator) {
        //     let facultyCoordinatorArray = facultyCoordinator.split(",");
        //     workshop1.facultyCoordinator = facultyCoordinatorArray
        // }
        // else {
        //     workshop1.depopulate("facultyCoordinator")
        // }

        //handle file here
        if (file.photo) {
            try {
                fs.unlinkSync(workshop1.photo);
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


            workshop1.photo = newPath1;

        }

        // //save to db

        workshop1.save((err, workshop1) => {
            if (err) {
                try {
                    fs.unlinkSync(newPath);
                } catch (err) {
                    console.log("file not found")
                }

                res.status(400).json({
                    error: "updating workshop in DB failed!!"
                });
            }
            res.json({
                message: "workshop updated successfully",
                workshop1
            })
        });
    });
}

exports.deleteWorkshop = (req, res) => {
    let workshop1 = req.workshop1;
    workshop1.remove((err, deletedWorkshop) => {
        if (err) {
            return res.status(400).json(
                failAction(" Workshop not found")
            )
        }

        try {
            fs.unlinkSync(deletedWorkshop.photo);
        } catch (err) {
            console.log("file not found")
        }
        res.json({
            message: "Deleted Successfully",
            deletedWorkshop
        })
    })
}

