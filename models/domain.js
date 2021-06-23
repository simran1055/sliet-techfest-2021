import mongoose from 'mongoose';

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
    studentCoordinatorName: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    studentCoordinatorPhone: {
        type: String,
        required: true,
        maxlength: 15,
        trim: true
    },
    studentCoordinatorEmail: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    facultyCoordinatorName: {
        type: String,
        required: true,
        trim: true,

        maxlength: 32,
    },
    facultyCoordinatorDesignation: {
        type: String,
        required: true,
        trim: true,

        maxlength: 32,
    },
    photo: {
        data: Buffer,
        contentType: String
    }
})


export default mongoose.model("Domain", domainSchema)