import jwt from "jsonwebtoken";
import { checkIfUserExist, handleApiErrors } from "../globalFunction.js";

/**
 * authentication middle for the API request
 * @param {JSON} req API request
 * @param {JSON} res API response
 * @param {function} next next function
 * @returns 
 */
export const isAuthenticated = async ( req, res, next) => {
    try {
        if(req.headers.authorization) {
            const bearerToken = req.headers.authorization.split(" ");
            const token = bearerToken[1];
            const authorizedUser = jwt.verify(token, process.env.JWT_PASSWORD);
            const user = await checkIfUserExist(authorizedUser.Email);
            if(!user) throw { code: 401, message: 'missing user data or modified user data' };
            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: 'Error', result: 'User token missing'});
        }
    } catch (error) {
        console.error(`Catch error inside isAuthenticated(): ${error.message}`);
        handleApiErrors(error, res);
    }
}