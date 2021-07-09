const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const TeamSchema = new mongoose.Schema({
    usersId: [
        {
            userId: {
                type: ObjectId,
                required: true
            },
            isAccepted: {
                type: Boolean,
                required: true,
                default: false
            },
            isActive: {
                type: Number,
                required: true,
                default: 1
            }
            // 0 for inactive 1 for active 2 for suspend and 3 for delete
        }
    ],
    leaderId: {
        type: ObjectId,
        required: true
    },
    eventId: {
        type: ObjectId,
        required: true
    },
    totalTeamMember: {
        type: Number,
        required: true
    },
    isParticipated: {
        type: Boolean,
        required: true,
        default: true
    },
})

module.exports = mongoose.model('Teams', TeamSchema);
