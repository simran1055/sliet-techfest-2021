import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
   email:{
    type: String,
    required: true,
    trim: true,
   }
})

export default mongoose.model('Subscribers', EmailSchema)
