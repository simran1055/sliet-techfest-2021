import { save } from '../services/user';
import { successAction, failAction } from '../utills/response'

// Create User 
export const createUser = async (req, res) => {
    try {
        const resp = await save(req.body)
        res.send(req.body)
    }
    catch (error) {
        res.status(400).json(failAction(error.message));
    }
}