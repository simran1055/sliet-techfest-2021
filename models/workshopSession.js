const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const workshopSessionSchema = new mongoose.Schema({

    // Date and time, Scheduled Link, Serial Number
    workshopSessionName: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    scheduledLink: {
        type: String,
        required: true,
        trim: true
    },
    workshopSessionId: {
        type: String,
        required: true,
        unique: true
    },
    workshopId: {
        type: ObjectId,
        ref: 'Workshop'
    }

})


module.exports = mongoose.model("WorkshopSession", workshopSessionSchema)