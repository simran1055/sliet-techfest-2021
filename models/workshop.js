const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const workshopSchema = new mongoose.Schema({
    workshopName: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    workshopDescription: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000
    },
    hostName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    hostDescription: {
        type: String,
        trim: true,
        required: true,
        maxlength: 200
    },
    startDate: {
        type: Date,

    },
    endDate: {
        type: Date,

    },
    whatsappGroupLink: {
        type: String,
        trim: true,
        required: true,

    },

    // workshopSessions: [{ type: ObjectId, ref: 'WorkshopSession' }],
    studentCoordinator: [{ type: ObjectId, ref: 'Coordinator' }],
    // facultyCoordinator: [{ type: ObjectId, ref: 'Coordinator' }],
    photo: {
        // data: Buffer,
        // contentType: String
        type: String,
        // required: true,
        // trim: true,
    }
})


module.exports = mongoose.model("Workshop", workshopSchema)