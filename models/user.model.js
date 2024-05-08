import { Schema, model } from 'mongoose';
import pkg from 'jsonwebtoken';
const { sign } = pkg;const userSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true, minlength: 4 },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['admin','unregisteredUser', 'registeredUser'] }
})
userSchema.pre('save', function (next) {
    const salt = process.env.BCRYPT_SALT;
    bcrypt.hash(this.password, salt, async (err, hashPass) => {
        if (err)
            throw new Error(err.message);

        this.password = hashPass;
        next()
    })
})
export const User = model('users', userSchema)

export function generateToken(user) {
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
    const data = { role: user.role, user_id: user._id };
    const token = sign(data, privateKey, { expiresIn: '3h' });
    return token;
}