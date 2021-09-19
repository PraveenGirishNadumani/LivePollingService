'use strict';

import { checkIfUserExist, handleApiErrors, validateEmail, Query } from "../globalFunction.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DB } from "../database/connection.js";

/**
 * controller for registering the user account
 * @param {JSON} req API request
 * @param {JSON} res API response
 * @returns 
 */
export const registerUser = async (req, res) => {
    try {

        if(!req.body.email || !req.body.password || !req.body.name) throw { code: 400, message: 'Email And Password is mandatory for registering the user'};
        if(!validateEmail(req.body.email)) throw { code: 400, message: 'Please enter valid email ID'};
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        if(await checkIfUserExist(req.body.email)) throw { code: 400, message: 'user this this email is already exists' };
        await DB.run(`INSERT INTO Users (Name, email, password) Values (?, ?, ?)`, [req.body.name, req.body.email, hashedPassword]);

        return res.json({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
    } catch (error) {
        console.error(`Catch error inside registerUser(): ${error.message}`);
        handleApiErrors(error, res);
    }
}

/**
 * controller for user login to system
 * @param {JSON} req API request 
 * @param {JSON} res API response
 * @returns 
 */
export const login = async (req, res) => {
    try {
        if(!req.body.email || !req.body.password) throw { code: 400, message: 'email and password are the mandatory fields' };
        const user = await checkIfUserExist(req.body.email);
        if(!user) throw { code: 404, message: 'user with the email ID does not exist' };
        const passwordMatch = await bcrypt.compare(req.body.password, user.Password);
        if(!passwordMatch) throw { code: 401, message: 'password mismatch, please pass the valid password' };

        const token = jwt.sign(user, process.env.JWT_PASSWORD);

        return res.json({ token : token});

    } catch (error) {
        console.error(`Catch error inside login(); ${error.message}`);
        handleApiErrors(error, res);
    }
}

/**
 * controller to fetch the user data
 * @param {JSON} req API Request 
 * @param {JSON} res API response
 * @returns 
 */
export const getMyDate = async (req, res) => {
    return res.json(req.user);
}

/**
 * controller to fetch the Poll date By user
 * @param {JSON} req API request
 * @param {JSON} res API response
 * @returns 
 */
export const getMyPolls = async (req, res) => {
    try {
        const myPollList = await DB.all(Query.getPollByUser, [req.user.user_id]);
        return res.json({
            myPollList: myPollList
        });
    } catch (error) {
        console.error(`Catch error inside getMyPolls() - user: ${error.message}`);
        handleApiErrors(error, res);
    }
}