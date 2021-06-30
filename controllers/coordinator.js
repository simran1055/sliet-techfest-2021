import Coordinator from '../models/coordinator'
import { successAction, failAction } from '../utills/response'
const formidable = require("formidable");
import fs from "fs"
import path from "path"
import _ from "lodash";

exports.getCoordinatorById = (req, res, next, id) => {
    Coordinator.findById(id).exec((err, coordinator1) => {
        if (err || !coordinator1) {
            return res.status(400).json({
                error: "Error while fetching Coordinator"
            })
        }

        req.coordinator1 = coordinator1
        next();
    })
}

exports.createCoordinator = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json(failAction("problem with something in form "))
        }

        const { coordinatorName,

            coordinatorPhone,
            coordinatorEmail,
            coordinatorType,

            coordinatorDesignation } = fields;

        if (!coordinatorName || !coordinatorPhone || !coordinatorEmail || !coordinatorType || (coordinatorType == "Faculty" && !coordinatorDesignation)) {
            // fs.unlinkSync(newPath);
            return res.status(400).json({
                error: "Please include all the fields"
            });
        }

        let coordinator1 = new Coordinator(fields);

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!"
                })
            }



            ///TODO: check file type



            var oldPath = file.photo.path;
            var newPath1 = Date.now() + '.' + file.photo.name.split('.').pop();
            var newPath = 'uploads/' + newPath1
            var rawData = fs.readFileSync(oldPath)

            fs.writeFile(newPath, rawData, function (err) {
                if (err) {

                    return res.status(400).json({
                        error: err
                    })
                }

            })







        }
        coordinator1.photo = newPath1;
        coordinator1.save((err, coordinator1) => {
            if (err) {

                try {
                    fs.unlinkSync(newPath);
                } catch (err) {
                    console.log("file not found")
                }
                return res.status(400).json({
                    error: "coordinator not saved in db, some error occured"
                })
            }

            res.json({
                message: "coordinator added successfully",
                coordinator1
            })
        })





    })
}

exports.getCoordinator = (req, res) => {
    req.coordinator1.photo = undefined;
    return res.json(req.coordinator1)
}

//middleware
exports.photo = (req, res, next) => {
    if (req.coordinator1.photo) {
        // res.set("Content-Type", req.coordinator1.photo.contentType);
        return res.send(req.coordinator1.photo);
    }
    next();
};
////////
exports.getAllCoordinators = (req, res) => {
    // let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    // let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Coordinator.find().exec((err, coordinators) => {
        if (err) {
            return res.status(400).json({
                error: "No Coordinator Found"
            });
        }
        res.json(coordinators);
    });
}

exports.updateCoordinator = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {

        if (err) {
            return res.status(400).json({
                error: "Some problem whith form"
            });
        }

        //updation
        let coordinator1 = req.coordinator1;

        coordinator1 = _.extend(coordinator1, fields);
        console.log(fields);

        //handle file here
        if (file.photo) {
            try {
                fs.unlinkSync(coordinator1.photo);
            } catch (err) {
                console.log("file not found")
            }
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!"
                });
            }



            var oldPath = file.photo.path;
            var newPath = '/uploads/' + Date.now() + '.' + file.photo.name.split('.').pop();
            var rawData = fs.readFileSync(oldPath)

            fs.writeFile(newPath, rawData, function (err) {
                if (err) {

                    return res.status(400).json({
                        error: err
                    })
                }

            })


            coordinator1.photo = newPath;

        }

        // //save to db

        coordinator1.save((err, coordinator) => {
            if (err) {
                try {
                    fs.unlinkSync(newPath);
                } catch (err) {
                    console.log("file not found")
                }

                res.status(400).json({
                    error: "updating coordinator in DB failed!!"
                });
            }
            res.json({
                message: "coordinator updated successfully",
                coordinator
            })
        });
    });
}

exports.deleteCoordinator = (req, res) => {
    let coordinator1 = req.coordinator1;
    coordinator1.remove((err, deletedCoordinator) => {
        if (err) {
            return res.status(400).json(
                failAction(" Coordinator not found")
            )
        }

        try {
            fs.unlinkSync(deletedCoordinator.photo);
        } catch (err) {
            console.log("file not found")
        }
        res.json({
            message: "Deleted Successfully",
            deletedCoordinator
        })
    })
}

