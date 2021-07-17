const Event = require('../models/events')
const { successAction, failAction } = require("../utills/response")


// todo add photo
exports.createEvent = (req, res) => {
    let payload = req.body;

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json(failAction("problem with something in form "))
        }
        fields = {
            ...fields, ...{
                eventCreatedBy: req.user._id
            }
        }

        if (file.photo) {

            var fur = uploadFileFunc(file);

            if (fur.error) {
                return res.status(400).json({
                    error: fur.error
                })
            }

            var newPath1 = fur;
            var newPath = 'upload/' + newPath1

        }
        fields.photo = newPath1;
        let event = new Event(payload);
        event.save((err, event) => {
            if (err) {
                try {
                    fs.unlinkSync(newPath);
                } catch (err) {
                    console.log("file not found")
                }
                return res.send(failAction('Some error accoured'))
            }
            res.send(successAction(event, "Event Added Successfully"))
        })
    })

    // payload = {
    //     ...payload, ...{
    //         eventCreatedBy: req.user._id
    //     }
    // }

}

exports.updateEvent = async (req, res) => {
    
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (file.photo) {
            try {
                fs.unlinkSync(domain1.photo);
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


            domain1.photo = newPath1;

        }
        Event.findOneAndUpdate(
            {
                _id: req.body._id
            },
            {
                $set: fields
            },
            (err, event) => {
                if (err) {
                    return res.send(failAction('Some error accoured'))
                }
                res.send(successAction(event, 'Update Successfully'))
            })
    })


    // let isEvent = await Event.findOne({ _id: req.body._id });
    // if (!isEvent) {
    //     return res.send(failAction('No Event Found'))
    // }

    // // Must be same User or Super admin that is '2'

    // if (!(isEvent.eventCreatedBy == req.user._id || req.user.role == 2)) {
    //     return res.send(failAction('You are not authorized to update this event'))
    // }
    // if (req.user.role != 2) {
    //     delete req.body['isActive'];
    // }

    
    Event.findOneAndUpdate(
        {
            _id: req.body._id
        },
        {
            $set: req.body
        },
        (err, event) => {
            if (err) {
                return res.send(failAction('Some error accoured'))
            }
            res.send(successAction(event, 'Update Successfully'))
        })
}

exports.deleteEvent = async (req, res) => {
    let isEvent = await Event.findOne({ _id: req.body._id });
    if (!isEvent) {
        return res.send(failAction('No Event Found'))
    }

    // Must be same User or Super admin that is '2'
    if (!(isEvent.eventCreatedBy == req.user._id || req.user.role == 2)) {
        return res.send(failAction('You are not authorized to update this event'))
    }
    Event.findOneAndUpdate({
        _id: req.body._id
    },
        {
            $set: { isActive: 3 }
        },
        (err, event) => {
            if (err) {
                return res.send(failAction('Some error accoured'))
            }
            res.send(successAction(event, 'Update Successfully'))
        })
}


exports.eventListAdmin = (req, res) => {
    if (req.user.role != 2) {
        return res.send(failAction('You are not authorized to update this event'))
    }
    let payload = {
        // Super admin can see all Events Except Deleted.
        isActive: { $lt: 3 }
    };
    Event.find(payload, (err, event) => {
        if (err) {
            return res.send(failAction('Some error accoured'))
        }
        res.send(successAction(event))
    })
}

exports.eventList = (req, res) => {
    let payload = {
        // User can only see approved Events
        isApproved: true
    };
    Event.find(payload, (err, event) => {
        if (err) {
            return res.send(failAction('Some error accoured'))
        }
        res.send(successAction(event))
    })
}


exports.getEvent = (req, res) => {
    let payload = {
        // User can only see approved Events
        _id: req.body._id,
        isApproved: true
    };
    Event.find(payload, (err, event) => {
        if (err) {
            return res.send(failAction('Some error accoured'))
        }
        res.send(successAction(event))
    })
}

exports.eventVerify = (req, res) => {
    if (req.user.role != 2) {
        return res.send(failAction('You are not authorized to update this event'))
    }
    Event.findOneAndUpdate(
        {
            _id: req.body._id
        },
        {
            $set: { isApproved: true }
        }, (err, event) => {
            if (err) {
                return res.send(failAction('Some error accoured'))
            }
            res.send(successAction(event))
        })
}