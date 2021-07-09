const Event = require('../models/events')
const { successAction, failAction } = require("../utills/response")

exports.createEvent = (req, res) => {
    let payload = req.body;
    payload = {
        ...payload, ...{
            eventCreatedBy: req.user._id
        }
    }
    let event = new Event(payload);
    event.save((err, event) => {
        if (err) {
            return res.send(failAction('Some error accoured'))
        }
        res.send(successAction(event, "Event Added Successfully"))
    })
}

exports.updateEvent = async (req, res) => {
    let isEvent = await Event.findOne({ _id: req.body._id });
    if (!isEvent) {
        return res.send(failAction('No Event Found'))
    }

    // Must be same User or Super admin that is '2'

    if (!(isEvent.eventCreatedBy == req.user._id || req.user.role == 2)) {
        return res.send(failAction('You are not authorized to update this event'))
    }
    if(req.user.role != 2){
        delete req.body['isActive'];
    }
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
    Event.find( payload, (err, event) => {
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
    Event.find( payload, (err, event) => {
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