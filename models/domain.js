const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const domainSchema = new mongoose.Schema({
    domainName: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    domainDescription: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000
    },
    studentCoordinator: [{ type: ObjectId, ref: 'Coordinator' }],
    facultyCoordinator: [{ type: ObjectId, ref: 'Coordinator' }],
    photo: {
        // data: Buffer,
        // contentType: String
        type: String,
        required: true,
        trim: true,
    }
})


module.exports = mongoose.model("Domain", domainSchema)