import mongoose from 'mongoose';

const SponsorSchema = new mongoose.Schema({
    orgName: {
        type: String,
        required: true,
        trim: true,
        unique: true

    },
    orgEmail: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    socialMedia: [
        {
            facebook: {
                type: String,
                trim: true
            },
            linkedIn : {
                type: String,
                trim: true
            },
            twitter: {
                type: String,
                trim: true
            },
            instagram: {
                type: String,
                trim: true
            }
        }
    ],
    website:{
        type: String,
        trim: true,
        unique: true
    },
    description:{
        type: String,
        trim: true,
    },
    orgLogo:{
        type: String,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isVerifiedByAdmin: {
        type: Boolean,
        default: false
    },
})

export default mongoose.model('Sponsors', SponsorSchema)
