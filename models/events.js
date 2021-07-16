const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const EventrSchema = new mongoose.Schema({
    eventName: {
        type: String,
        require: true,
        trim: true
    },
    domainRefId: {
        type: ObjectId,
        require: true,
        trim: true,
        ref: 'Domain'
    },
    eventCreatedDate: {
        type: Date,
        require: true,
        trim: true,
        default: Date.now()
    },
    startDate: {
        type: Date,
        require: true
    },
    endDate: {
        type: Date,
        require: true
    },
    participantCount: {
        type: String,
        require: true,
        trim: true
    },
    eventCordinatorName: {
        type: String,
        require: true,
        trim: true
    },
    eventCreatedBy: {
        type: ObjectId,
        require: true,
        trim: true,
        ref: 'User'
    },
    evnetLink: {
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
            require: true,
            trim: true,
            ref: 'User'

        }
    }],
    isApproved: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Number,
        default: 1
    }// 0 for inactive, 1 for active, 2 for suspended, 3 for delete

})

module.exports = mongoose.model('Events', EventrSchema)
