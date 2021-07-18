const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const EventrSchema = new mongoose.Schema({
    eventName: {
        type: String,
        require: true,
        trim: true
    },
    photo: {
        type: String,
        trim: true
    },
    domainRefId: {
        type: ObjectId,
        require: true,
        trim: true,
        ref: 'Domain'
    },
    eventDate: {
        type: Date,
        require: true,

    },

    regEndDate: {
        type: Date,
        require: true
    },

    participantCountMin: {
        type: Number,
        require: true,
        default: 1
    },
    participantCountMax: {
        type: Number,
        require: true,
        default: 1
    },
    eventCoordinator: [{ type: ObjectId, ref: "Coordinator" }],
    // eventCreatedBy: {
    //     type: ObjectId,
    //     // require: true,
    //     trim: true,
    //     ref: 'User'
    // },
    eventLink: {
        type: String,
        // require: true,
        trim: true
    },
    prize: [],
    winningTeams: [{
        rank: {
            type: Number,
            require: true,
            trim: true
        },
        teamRef: {
            type: ObjectId,
            trim: true,
            ref: 'User'

        }
    }],
    isApproved: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Number,
        default: 1
    }, // 0 for inactive, 1 for active, 2 for suspended, 3 for delete
    eventDescription: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Events', EventrSchema)
