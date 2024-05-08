import jwt from "jsonwebtoken";

export async function isManager(req, res, next) {
    try {
        const { authorization } = req.headers;
        const [, token] = authorization.split(' ');
        const key = process.env.JWT_SECRET || 'JWT_SECRET';
        const data = jwt.verify(token, key);
        req.user = data; //details who's create the token
        next();
    } catch (error) {
        next({ message: error, status: 401 })

    }
}

export async function isRegisteredUser(req, res, next) {
    try {
        const { authorization } = req.headers;
        const [, token] = authorization.split(' ');
        const key = process.env.JWT_SECRET || 'JWT_SECRET';
        const data = jwt.verify(token, key);
        req.user = data; //details who's create the token
        next();
    } catch (error) {
        next({ message: error, status: 401 })

    }
}