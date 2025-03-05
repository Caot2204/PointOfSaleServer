import 'dotenv/config';
import jsonwebtoken from 'jsonwebtoken';
import userRepository from '../datasource/repository/userRepository.js';

/**
 * 
 * @param {String} userName User's name that wants to login
 * @returns valid token to access the api
 */
export function generateToken(userName) {
    return jsonwebtoken.sign({ userName }, process.env.JSW_TOKEN_SECRET, { expiresIn: '1h' });
}

/**
 * Verify that the recived token is valid and it's registered in the api, so, adds the user's name
 * to request to validate what type of user is
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        const dataToken = jsonwebtoken.verify(token, process.env.JSW_TOKEN_SECRET);
        req.userName = dataToken.userName;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Token invalid" });
    }
}

/**
 * Verify that user logged is an Admin
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export async function verifyIfAdminUser(req, res, next) {
    const userName = req.userName;
    try {
        const isAdmin = await userRepository.isAdminUser(userName);
        if (isAdmin) next();
        else res.status(401).json({ message: "User not authorized to perform this action" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}