import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import Joi from 'joi';

const { sign } = jwt;

const userSchema = new Schema({
    username: { type: String, required: true, minLength: 2, maxLength: 20, match: /^[a-zA-Z]/ },
    password: { type: String, required: true, minlength: 4 },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['admin', 'user'] }
});

userSchema.pre('save', async function (next) {
    const salt = process.env.BCRYPT_SALT;
    try {
        const hashPass = bcrypt.hash(this.password, salt);
        this.password = hashPass;
        next();
    } catch (error) {
        next(error);
    }
});

export const User = model('users', userSchema);

export const userValidators = {
    login: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(10),
    })
};

export function generateToken(user) {
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
    const data = { role: user.role, user_id: user._id };
    const token = sign(data, privateKey, { expiresIn: '3h' });
    return token;
}
