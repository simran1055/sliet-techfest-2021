const mongoose = require('mongoose');

const workshopSessionSchema = new mongoose.Schema({

    // Date and time, Scheduled Link, Serial Number

    dateTime: {
        type: Date,
        required: true
    },
    scheduledLink: {
        type: String,
        required: true,
        trim: true
    },
    worshopSessionId: {
        type: String,
        required: true
    },
    workshopId: {
        type: ObjectId,
        ref: 'WorkshopSession'
    }

})


module.exports = mongoose.model("WorkshopSession", workshopSessionSchema)