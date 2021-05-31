import User from '../models/user';
import {encryptpassword} from '../utills/tokens'

export const save = async (payload) => {
    if(await User.findOne({ userName: payload.userName })) throw new Error('User Name is already registerd');
    if(await User.findOne({ userEmail: payload.userEmail })) throw new Error('User Email is already registerd');
    payload.userPass = encryptpassword(payload.userPass);
    const alien = new User(payload)
    await alien.save();
    return;
}