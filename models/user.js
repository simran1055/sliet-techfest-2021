import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    userName: String,
    userEmail: String,
    userReg: String,
    userPass:String,
    gender:String,
    createdAt: {
        type: Date,
        default: new Date()
    },
})

export default mongoose.model('Users', UserSchema)