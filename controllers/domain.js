import Domain from '../models/domain'
import { successAction, failAction } from '../utills/response'
const formidable = require("formidable");
import fs from "fs"

exports.getDomainById = (req, res, next, id) => {
    Domain.findById(id).exec((err, domain) => {
        if (err || !domain) {
            return res.status(400).json({
                error: "Error while fetching Domain"
            })
        }

        req.domain = domain
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
            studentCoordinatorName,
            studentCoordinatorPhone,
            studentCoordinatorEmail,
            facultyCoordinatorName,
            facultyCoordinatorDesignation } = fields;

        if (!domainName || !domainDescription || !studentCoordinatorName || !studentCoordinatorPhone || !studentCoordinatorEmail || !facultyCoordinatorName || !facultyCoordinatorDesignation) {
            return res.status(400).json({
                error: "Please include all the fields"
            });
        }



        let domain = new Domain(fields);


        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!"
                })
            }



            ///TODO: check file type

            domain.photo.data = fs.readFileSync(file.photo.path)

            domain.photo.contentType = file.photo.type;


            domain.save((err, domain) => {
                if (err) {
                    return res.status(400).json({
                        error: "Saving domain in db failed"
                    })
                }

                res.json({
                    message: "domain added successfully",
                    domain
                })
            })



        }

    })
}

exports.getDomain = (req, res) => {
    req.domain.photo = undefined;
    return res.json(req.product)
}

//middleware
exports.photo = (req, res, next) => {
    if (req.domain.photo.data) {
        res.set("Content-Type", req.domain.photo.contentType);
        return res.send(req.domain.photo.data);
    }
    next();
};
////////
exports.getAllDomains = () => {

}

exports.updateDomain = () => {

}

exports.deleteDomain = (req, res) => {
    let domain = req.domain;
    domain.remove((err, deletedDomain) => {
        if (err) {
            return res.status(400).json(
                failAction(" Domain not found")
            )
        }

        res.json({
            message: "Deleted Successfully",
            deletedDomain
        })
    })
}

