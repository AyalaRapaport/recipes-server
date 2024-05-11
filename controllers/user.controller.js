import { generateToken, User } from '../models/user.model.js';
import { compare } from 'bcrypt';
import { userValidators } from '../models/user.model.js';

export async function signIn(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        compare(password, user.password, (error, same) => {
            if (error) {
                return next(new Error(error.message));
            }
            if (same) {
                const token = generateToken(user);
                user.password = "****";
                return res.send({ user, token });
            }
        })
        return next({ message: 'Auth Failed', status: 401 })
    }
    else {
        return next({ message: 'Auth Failed', status: 401 })
    }
}

export async function signUp(req, res, next) {
    const { username, email, password, address, role } = req.body;
    const isValid = userValidators.login.validate({ email, password });
    if (isValid.error) {
        return next({ message: isValid.error.message })

    } try {
        const user = new User({ username, email, password, address, role });
        await user.save();
        console.log(user);
        const token = generateToken(user);
        user.password = "****";
        return res.status(201).json({ user, token });
    } catch (error) {
        return next({ message: error.message, status: 409 })
    }

}

export async function getAllUsers(req, res, next) {
    try {
        const users = await User.find().select('-__v')
        return res.json(users);
    } catch (error) {
        next(error);
    }
}
