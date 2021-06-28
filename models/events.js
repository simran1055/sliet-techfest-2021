const mongoose = require('mongoose');

const SponsorSchema = new mongoose.Schema({
    eventName: {
        type: String,
        require: true,
        trim: true
    },
    domainRefId: {
        type: ObjectId,
        require: true,
        trim: true
    },
    domainCreatedDate: {
        type: Date,
        require: true,
        trim: true,
        default: Date.now()
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
    evnetLink: {
        type: String,
        require: true,
        trim: true
    },
    winningTeams:
        [{
            rank: {
                type: Number,
                require: true,
                trim: true
            },
            prize: {
                type: String,
                require: true,
                trim: true
            },
            teamRef: {
                type: ObjectId,
                require: true,
                trim: true
            }
        }],
})