import Domain from '../models/domain'
import { successAction, failAction } from '../utills/response'
const formidable = require("formidable");
import fs from "fs"
import path from "path"
import _ from "lodash";

exports.getDomainById = (req, res, next, id) => {
    Domain.findById(id).populate('studentCoordinator').populate('facultyCoordinator').exec((err, domain1) => {
        if (err || !domain1) {
            return res.status(400).json({
                error: "Error while fetching Domain"
            })
        }

        req.domain1 = domain1
        next();
    })
}

exports.createDomain = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json(failAction("problem with something in form "))
        }

        const { domainName,
            domainDescription,
            studentCoordinator,
            facultyCoordinator,
        } = fields;

        if (!domainName || !domainDescription || !studentCoordinator || !facultyCoordinator) {
            // fs.unlinkSync(newPath);
            return res.status(400).json({
                error: "Please include all the fields"
            });
        }


        let studentCoordinatorArray = studentCoordinator.split(",");

        let facultyCoordinatorArray = facultyCoordinator.split(",");



        let domain1 = new Domain({
            domainName,
            domainDescription,
            studentCoordinator: studentCoordinatorArray,
            facultyCoordinator: facultyCoordinatorArray,
        });

        console.log("hello  asdjhak  " + file.photo)

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!"
                })
            }



            ///TODO: check file type



            var oldPath = file.photo.path;
            // var newPath = path.join(__dirname, '../uploads')
            //     + '/' + Date.now() + '.' + file.photo.name.split('.').pop();
            var newPath1 = Date.now() + '.' + file.photo.name.split('.').pop();
            var newPath = 'uploads/' + newPath1

            var rawData = fs.readFileSync(oldPath)
            console.log("hello" + oldPath, newPath)
            fs.writeFile(newPath, rawData, function (err) {
                if (err) {

                    return res.status(400).json({
                        error: err
                    })
                }

            })







        }
        domain1.photo = newPath1;
        domain1.save((err, domain1) => {
            if (err) {

                try {
                    fs.unlinkSync(newPath);
                } catch (err) {
                    console.log("file not found")
                }
                return res.status(400).json({
                    error: "domain not saved in db, some error occured"
                })
            }

            res.json({
                message: "domain added successfully",
                domain1
            })
        })





    })
}

exports.getDomain = (req, res) => {
    // req.domain1.photo = undefined;
    return res.json(req.domain1)
}

//middleware
exports.photo = (req, res, next) => {
    if (req.domain1.photo) {
        // res.set("Content-Type", req.domain1.photo.contentType);
        return res.send(req.domain1.photo);
    }
    next();
};
////////
exports.getAllDomains = (req, res) => {
    // let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    // let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Domain.find().populate('studentCoordinator').populate('facultyCoordinator').exec((err, domains) => {
        if (err) {
            return res.status(400).json({
                error: "No Domain Found"
            });
        }
        res.json(domains);
    });
}

exports.updateDomain = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {

        if (err) {
            return res.status(400).json({
                error: "Some problem whith form"
            });
        }

        //updation
        let domain1 = req.domain1;

        const { domainName,
            domainDescription,
            studentCoordinator,
            facultyCoordinator,
        } = fields;



        domain1 = _.extend(domain1, fields);

        console.log(facultyCoordinator)


        if (studentCoordinator) {
            let studentCoordinatorArray = studentCoordinator.split(",");
            domain1.studentCoordinator = studentCoordinatorArray
        }
        //  else {
        //     domain1.depopulate("studentCoordinator")
        // }

        if (facultyCoordinator) {
            let facultyCoordinatorArray = facultyCoordinator.split(",");
            domain1.facultyCoordinator = facultyCoordinatorArray
        }
        // else {
        //     domain1.depopulate("facultyCoordinator")
        // }

        //handle file here
        if (file.photo) {
            try {
                fs.unlinkSync(domain1.photo);
            } catch (err) {
                console.log("file not found")
            }
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!"
                });
            }



            var oldPath = file.photo.path;
            var newPath = path.join(__dirname, '../uploads')
                + '/' + Date.now() + '.' + file.photo.name.split('.').pop();
            var rawData = fs.readFileSync(oldPath)

            fs.writeFile(newPath, rawData, function (err) {
                if (err) {

                    return res.status(400).json({
                        error: err
                    })
                }

            })


            domain1.photo = newPath;

        }

        // //save to db

        domain1.save((err, domain1) => {
            if (err) {
                try {
                    fs.unlinkSync(newPath);
                } catch (err) {
                    console.log("file not found")
                }

                res.status(400).json({
                    error: "updating domain in DB failed!!"
                });
            }
            res.json({
                message: "domain updated successfully",
                domain1
            })
        });
    });
}

exports.deleteDomain = (req, res) => {
    let domain1 = req.domain1;
    domain1.remove((err, deletedDomain) => {
        if (err) {
            return res.status(400).json(
                failAction(" Domain not found")
            )
        }

        try {
            fs.unlinkSync(deletedDomain.photo);
        } catch (err) {
            console.log("file not found")
        }
        res.json({
            message: "Deleted Successfully",
            deletedDomain
        })
    })
}

