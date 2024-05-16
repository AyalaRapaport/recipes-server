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

userSchema.pre('save', function (next) {
    const salt = +process.env.BCRYPT_SALT | 10;
    bcrypt.hash(this.password, salt, async (err, hashPass) => {
        if (err)
            throw new Error(err.message);
        this.password = hashPass;
        console.log("pre"+this.password);
        next()
    })
});

export const User = model('users', userSchema);

export const userValidators = {
    login: Joi.object().keys({
        email: Joi.string().email().required().messages({
            'string.email': 'יש להזין כתובת דוא"ל תקינה',
            'any.required': 'שדה האימייל הוא שדה חובה'
        }),
        password: Joi.string().min(4).required().pattern(new RegExp('^(?=.*?[a-zA-Z])(?=.*?[0-9]).{4,}$')).messages({
            'string.min': 'הסיסמה חייבת להכיל לפחות 8 תווים',
            'string.pattern.base': 'הסיסמה חייבת לכלול לפחות אות אחת באנגלית ולפחות מספר אחד'
        }),
    })
};

export function generateToken(user) {
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
    const data = { role: user.role, user_id: user._id };
    const token = sign(data, privateKey, { expiresIn: '3h' });
    return token;
}
